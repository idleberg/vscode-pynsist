'use babel';

// Dependencies
import { mkdir, writeFile } from 'fs';
import { join } from 'path';
import { workspace, window } from 'vscode';

// Package Components
import { getConfig, getPath, sanitize } from './util';

const createTask = () => {
  if (typeof workspace.rootPath === 'undefined' || workspace.rootPath === null) {
    return window.showErrorMessage('Task support is only available when working on a workspace folder. It is not available when editing single files.');
  }

  getPath()
  .then(sanitize)
  .then( (pathToPynsist: string) => {
    const { version } = require('../package.json');

    const taskFile: Object = {
        'command': 'pynsist',
        'version': version,
        'args': ['${file}'],
        'isShellCommand': false,
        'showOutput': 'always',
        'suppressTaskName': true,
        'echoCommand': false,
        'group': {
            'kind': 'build',
            'isDefault': true
        }
    };

    const jsonString: string = JSON.stringify(taskFile, null, 2);
    const dotFolder: string = join(workspace.rootPath, '/.vscode');
    const buildFile: string = join(dotFolder, 'tasks.json');

    mkdir(dotFolder, (error) => {
      // ignore errors for now
      writeFile(buildFile, jsonString, (error) => {
        if (error) {
          return window.showErrorMessage(error.toString());
        }
        if (getConfig().alwaysOpenBuildTask === false) return;

        // Open tasks.json
        workspace.openTextDocument(buildFile).then( (doc) => {
            window.showTextDocument(doc);
        });
      });
    });
  })
  .catch( error => {
    window.showErrorMessage(error.toString());
  });
};

export { createTask };
