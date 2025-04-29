import { type ExtensionContext, commands } from 'vscode';
import { generate } from './pynsist';
import { createTask } from './task';

export async function activate(context: ExtensionContext): Promise<void> {
	context.subscriptions.push(
		commands.registerTextEditorCommand('extension.pynsist.generate', () => {
			generate(false);
		}),
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand('extension.pynsist.compile', () => {
			generate(true);
		}),
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand('extension.pynsist.create-build-task', () => {
			createTask();
		}),
	);
}
