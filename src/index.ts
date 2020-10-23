'use strict';

// Dependencies
import { commands, ExtensionContext } from 'vscode';

// Package Components
import { generate } from './pynsist';
import { createTask} from './task';

async function activate(context: ExtensionContext): Promise<void> {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.generate', () => {
        generate(false);
      })
    );
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.compile', () => {
        generate(true);
      })
    );
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.create-build-task', () => {
        createTask();
      })
    );
}

export { activate };
