'use strict';

// Dependencies
import { commands, ExtensionContext } from 'vscode';

// Package Components
import { createTask} from './task';
import { generate } from './pynsist';
import { getConfig } from 'vscode-get-config';
import { reporter } from './telemetry';

async function activate(context: ExtensionContext): Promise<void> {
  const { disableTelemetry } = await getConfig('pynsist');

  if (disableTelemetry === false) {
    context.subscriptions.push(reporter);
  }

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
