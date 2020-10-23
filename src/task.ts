// Dependencies
import { getConfig } from 'vscode-get-config';
import { join } from 'path';
import { mkdir, writeFile } from 'fs';
import { workspace, window } from 'vscode';

// Package Components
import { getPath, sanitize } from './util';

async function createTask(): Promise<void> {
  if (typeof workspace.rootPath === 'undefined' || workspace.rootPath === null) {
    window.showErrorMessage('Task support is only available when working on a workspace folder. It is not available when editing single files.');
    return;
  }

  getPath()
  .then(sanitize)
  .then( async(pathToPynsist: string) => {

    const taskFile: unknown = {
      'version': '2.0.0',
      'tasks': [
        {
          'label': 'pynsist: Compile Installer',
          'type': 'shell',
          'command': `${pathToPynsist}`,
          'args': [ '${file}' ],
          'group': 'build'
        },
        {
          'label': 'pynsist: Generate Script',
          'type': 'shell',
          'command': `${pathToPynsist}`,
          'args': [ '--no-makensis', '${file}' ],
          'group': 'build'
        }
      ]
    };

    const jsonString: string = JSON.stringify(taskFile, null, 2);
    const dotFolder: string = join(workspace.rootPath, '/.vscode');
    const buildFile: string = join(dotFolder, 'tasks.json');

    mkdir(dotFolder, () => {
      // ignore errors for now
      writeFile(buildFile, jsonString, async (error) => {
        if (error) {
          window.showErrorMessage(error.toString());
          return;
        }
        if (await getConfig('pynsist.alwaysOpenBuildTask') === false) return;

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
}

export { createTask };
