import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { window, workspace } from 'vscode';
import { getConfig } from 'vscode-get-config';
import { fileExists, getPath } from './util';

export async function createTask(): Promise<unknown> {
	if (typeof workspace.workspaceFolders === 'undefined') {
		return window.showErrorMessage(
			'Task support is only available when working on a workspace folder. It is not available when editing single files.',
		);
	}

	const pathToPynsist = await getPath();

	const taskFile: unknown = {
		version: '2.0.0',
		tasks: [
			{
				label: 'pynsist: Compile Installer',
				type: 'shell',
				command: `${pathToPynsist}`,
				// biome-ignore lint/suspicious/noTemplateCurlyInString: false positive
				args: ['${file}'],
				group: 'build',
			},
			{
				label: 'pynsist: Generate Script',
				type: 'shell',
				command: `${pathToPynsist}`,
				// biome-ignore lint/suspicious/noTemplateCurlyInString: false positive
				args: ['--no-makensis', '${file}'],
				group: 'build',
			},
		],
	};

	if (!workspace.workspaceFolders[0]?.uri.fsPath) {
		window.showErrorMessage('Did not find workspace folder.');
		return;
	}

	const jsonString = JSON.stringify(taskFile, null, 2);
	const dotFolder = join(workspace.workspaceFolders[0].uri.fsPath, '/.vscode');
	const buildFile = join(dotFolder, 'tasks.json');

	try {
		await fs.mkdir(dotFolder);
	} catch {
		console.warn('[idleberg.pynsist] This workspace already contains a .vscode folder.');
	}

	if (await fileExists(buildFile)) {
		const overwrite = 'Overwrite';
		const result = await window.showWarningMessage('This workspace already has a task file.', overwrite, 'Cancel');

		if (result !== overwrite) {
			return;
		}
	}

	try {
		await fs.writeFile(buildFile, jsonString);
		const { alwaysOpenBuildTask } = await getConfig('pynsist');

		if (alwaysOpenBuildTask) {
			const taskFile = await workspace.openTextDocument(buildFile);
			window.showTextDocument(taskFile);
		}
	} catch (error) {
		console.error('[idleberg.nsis]', error instanceof Error ? error.message : error);
	}
}

// export async function createTask(): Promise<void> {
// 	if (typeof workspace.workspaceFolders === 'undefined' || workspace.workspaceFolders.length < 1) {
// 		window.showErrorMessage(
// 			'Task support is only available when working on a workspace folder. It is not available when editing single files.',
// 		);
// 		return;
// 	}

// 	getPath()
// 		.then((path) => sanitize(path.toString()))
// 		.then(async (pathToPynsist: string) => {
// 			const taskFile: unknown = {
// 				version: '2.0.0',
// 				tasks: [
// 					{
// 						label: 'pynsist: Compile Installer',
// 						type: 'shell',
// 						command: `${pathToPynsist}`,
// 						// biome-ignore lint/suspicious/noTemplateCurlyInString: false positive
// 						args: ['${file}'],
// 						group: 'build',
// 					},
// 					{
// 						label: 'pynsist: Generate Script',
// 						type: 'shell',
// 						command: `${pathToPynsist}`,
// 						// biome-ignore lint/suspicious/noTemplateCurlyInString: false positive
// 						args: ['--no-makensis', '${file}'],
// 						group: 'build',
// 					},
// 				],
// 			};

// 			const jsonString: string = JSON.stringify(taskFile, null, 2);
// 			const dotFolder: string = resolve(workspace.workspaceFolders?.[0]?.uri.fsPath, '.vscode');
// 			const buildFile: string = join(dotFolder, 'tasks.json');

// 			mkdir(dotFolder, () => {
// 				// ignore errors for now
// 				writeFile(buildFile, jsonString, async (error) => {
// 					if (error) {
// 						window.showErrorMessage(error.toString());
// 						return;
// 					}
// 					if ((await getConfig('pynsist.alwaysOpenBuildTask')) === false) return;

// 					// Open tasks.json
// 					workspace.openTextDocument(buildFile).then((doc) => {
// 						window.showTextDocument(doc);
// 					});
// 				});
// 			});
// 		})
// 		.catch((error) => {
// 			window.showErrorMessage(error.toString());
// 		});
// }
