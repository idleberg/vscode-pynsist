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
      'version': '2.0.0',
      'tasks': [
        {
          'label': 'pynsist: Compile Installer',
          'type': 'shell',
          'command': 'pynsist',
          'args': [ '${file}' ],
          'group': 'build'
        },
        {
          'label': 'pynsist: Generate Script',
          'type': 'shell',
          'command': 'pynsist',
          'args': [ '--no-makensis', '${file}' ],
          'group': 'build'
        }
      ]
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
