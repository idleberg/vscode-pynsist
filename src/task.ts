// @ts-expect-error TODO Fix package
import { getConfig } from "vscode-get-config";
import { join, resolve } from "path";
import { mkdir, writeFile } from "fs";
import { workspace, window } from "vscode";
import { getPath, sanitize } from "./util";

async function createTask(): Promise<void> {
	if (
		typeof workspace.workspaceFolders === "undefined" ||
		workspace.workspaceFolders.length < 1
	) {
		window.showErrorMessage(
			"Task support is only available when working on a workspace folder. It is not available when editing single files.",
		);
		return;
	}

	getPath()
		.then((path) => sanitize(path.toString()))
		.then(async (pathToPynsist: string) => {
			const taskFile: unknown = {
				version: "2.0.0",
				tasks: [
					{
						label: "pynsist: Compile Installer",
						type: "shell",
						command: `${pathToPynsist}`,
						args: ["${file}"],
						group: "build",
					},
					{
						label: "pynsist: Generate Script",
						type: "shell",
						command: `${pathToPynsist}`,
						args: ["--no-makensis", "${file}"],
						group: "build",
					},
				],
			};

			const jsonString: string = JSON.stringify(taskFile, null, 2);
			const dotFolder: string = resolve(
				workspace.workspaceFolders![0]!.uri.fsPath,
				".vscode",
			);
			const buildFile: string = join(dotFolder, "tasks.json");

			mkdir(dotFolder, () => {
				// ignore errors for now
				writeFile(buildFile, jsonString, async (error) => {
					if (error) {
						window.showErrorMessage(error.toString());
						return;
					}
					if ((await getConfig("pynsist.alwaysOpenBuildTask")) === false)
						return;

					// Open tasks.json
					workspace.openTextDocument(buildFile).then((doc) => {
						window.showTextDocument(doc);
					});
				});
			});
		})
		.catch((error) => {
			window.showErrorMessage(error.toString());
		});
}

export { createTask };
