'use strict';

import { commands } from 'vscode';

// Load package components
import { generate } from './pynsist';

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
};

export { activate };
