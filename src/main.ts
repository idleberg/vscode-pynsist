'use strict';

// Dependencies
import { commands } from 'vscode';

// Package Components
import { generate } from './pynsist';
import { createTask} from './task';

const activate = (context) => {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.generate', (editor) => {
        return generate(false);
      })
    );
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.compile', (editor) => {
        return generate(true);
      })
    );
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.pynsist.create-build-task', () => {
        return createTask();
      })
    );
};

export { activate };
