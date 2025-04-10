import { commands, type ExtensionContext } from "vscode";
import { createTask } from "./task";
import { generate } from "./pynsist";

export async function activate(context: ExtensionContext): Promise<void> {
	context.subscriptions.push(
		commands.registerTextEditorCommand("extension.pynsist.generate", () => {
			generate(false);
		}),
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand("extension.pynsist.compile", () => {
			generate(true);
		}),
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand(
			"extension.pynsist.create-build-task",
			() => {
				createTask();
			},
		),
	);
}
