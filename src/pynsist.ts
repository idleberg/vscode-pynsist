// Dependencies
import { dirname } from "path";
// @ts-expect-error TODO Fix package
import { getConfig } from "vscode-get-config";
import { spawn } from "child_process";
import { workspace, window } from "vscode";

// Package Components
import {
	clearOutput,
	detectOutput,
	getPath,
	pathWarning,
	runInstaller,
	sanitize,
} from "./util";

const channel = window.createOutputChannel("pynsist");

/*
 *  Requires pynsist
 *  https://pypi.python.org/pypi/pynsist
 *  https://github.com/takluyver/pynsist
 */
async function generate(runMakensis: boolean): Promise<void> {
	await clearOutput(channel);

	const doc = window?.activeTextEditor?.document;

	if (!doc) {
		console.error("[idleberg.applescript] Document not found");
		return;
	}

	const scope = doc.languageId;

	if (scope !== "properties" && doc.fileName === "installer.cfg") {
		channel.appendLine(
			"This command is only available for Pynsist Configuration files",
		);
		return;
	}

	const { showNotifications } = await getConfig("pynsist");

	doc.save().then(async () => {
		await getPath()
			.then((path) => sanitize(path.toString()))
			.then((pathToPynsist: string) => {
				if (typeof pathToPynsist === "undefined" || pathToPynsist === null) {
					return window.showErrorMessage(
						"No valid `pynsist` was specified in your config",
					);
				}

				const defaultArguments: Array<string> = [doc.fileName];

				if (runMakensis === false) {
					defaultArguments.push("--no-makensis");
				}

				// Let's build
				const pynsist = spawn(pathToPynsist, defaultArguments);

				const scriptPath: string = dirname(doc.fileName);
				let outScript = "";
				let outFile = "";

				pynsist.stdout.on("data", (line: string) => {
					channel.appendLine(line.toString().trim());
				});

				// pynsist currently outputs to stderr only (v1.12)
				pynsist.stderr.on("data", async (line: string) => {
					channel.appendLine(line.toString().trim());

					if (outScript === "") {
						outScript = await detectOutput(scriptPath, line, {
							string: "Writing NSI file to ",
							regex: /Writing NSI file to (.*)\r?\n/g,
						});
					}

					if (outFile === "" && runMakensis === true) {
						outFile = await detectOutput(scriptPath, line, {
							string: "Installer written to ",
							regex: /Installer written to (.*)\r?\n/g,
						});
					}
				});

				pynsist.on("close", async (code) => {
					if (code === 0) {
						if (showNotifications) {
							if (runMakensis === true) {
								window
									.showInformationMessage(
										"Successfully compiled installer",
										"Run Installer",
										"Open Script",
									)
									.then(async (choice) => {
										if (choice === "Run Installer") {
											await runInstaller(outFile);
										} else if (choice === "Open Script") {
											workspace.openTextDocument(outScript).then((doc) => {
												window.showTextDocument(doc);
											});
										}
									});
							} else {
								window
									.showInformationMessage(
										"Successfully generated script",
										"Open Script",
									)
									.then((choice) => {
										if (choice === "Open Script") {
											workspace.openTextDocument(outScript).then((doc) => {
												window.showTextDocument(doc);
											});
										}
									});
							}
						}
					} else {
						channel.show(true);
						if (showNotifications)
							window.showErrorMessage(
								"Something went wrong. See the output for details.",
							);
					}
				});
			})
			.catch(pathWarning);
	});
}

export { generate };
