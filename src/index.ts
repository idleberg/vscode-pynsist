import { commands, type ExtensionContext } from 'vscode';
import { generate } from './pynsist';
import { createTask } from './task';

export async function activate(context: ExtensionContext): Promise<void> {
	context.subscriptions.push(
		commands.registerTextEditorCommand('extension.pynsist.generate', () => {
			generate(false);
		}),

		commands.registerTextEditorCommand('extension.pynsist.compile', () => {
			generate(true);
		}),
		commands.registerTextEditorCommand('extension.pynsist.createBuildTask', () => {
			createTask();
		}),

		commands.registerCommand('extension.pynsist.open-settings', async () => {
			commands.executeCommand('workbench.action.openSettings', '@ext:idleberg.pynsist');
		}),
	);
}
