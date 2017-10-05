'use strict';

import { workspace, window } from 'vscode';

import { clearOutput, detectOutput, getConfig, getPath, pathWarning, runInstaller, sanitize } from './util';
import { spawn } from 'child_process';
import { dirname } from 'path';

const channel = window.createOutputChannel('pynsist');

/*
 *  Requires pynsist
 *  https://pypi.python.org/pypi/pynsist
 *  https://github.com/takluyver/pynsist
 */
const generate = (runMakensis) => {
  clearOutput(channel);

  let doc = window.activeTextEditor.document;

  if (window.activeTextEditor['_documentData']['_languageId'] !== 'properties' && doc.fileName === 'installer.cfg') {
    channel.appendLine('This command is only available for Pynsist Configuraiton files');
    return;
  }

  let config: any = getConfig();

  doc.save().then( () => {
    getPath()
    .then(sanitize)
    .then( (pathToPynsist: string) => {

      if (typeof pathToPynsist === 'undefined' || pathToPynsist === null) {
        return window.showErrorMessage('No valid `pynsist` was specified in your config');
      }

      let defaultArguments: Array<string> = [doc.fileName];
      if (runMakensis === false) {
        defaultArguments.push('--no-makensis');
      }

      // Let's build
      const pynsist = spawn(pathToPynsist, defaultArguments);

      let scriptPath: string = dirname(doc.fileName);
      let outScript: string = '';
      let outFile: string = '';

      pynsist.stdout.on('data', (line: Array<any>) => {
        channel.appendLine(line.toString().trim());
      });

      // pynsist currently outputs to stderr only (v1.12)
      pynsist.stderr.on('data', (line: Array<any>) => {
        channel.appendLine(line.toString().trim());

        if (outScript === '') {
          outScript = detectOutput(scriptPath, line, { string: 'Writing NSI file to ', regex: /Writing NSI file to (.*)\r?\n/g });
        }

        if (outFile === '' && runMakensis === true) {
          outFile = detectOutput(scriptPath, line, { string: 'Installer written to ', regex: /Installer written to (.*)\r?\n/g });
        }
      });

      pynsist.on('close', (code) => {
        if (code === 0) {
          if (config.showNotifications) {
            let btnPrimary, btnSecondary;

            if (runMakensis === true) {
              window.showInformationMessage('Successfully compiled installer', 'Run Installer', 'Open Script')
              .then((choice) => {
                if (choice === 'Run Installer') {
                  runInstaller(outFile);
                } else if (choice === 'Open Script') {
                  workspace.openTextDocument(outScript)
                  .then( (doc) => {
                    window.showTextDocument(doc);
                  });
                }
              });
            } else {
              window.showInformationMessage('Successfully generated script', 'Open Script')
              .then((choice) => {
                if (choice === 'Open Script') {
                  workspace.openTextDocument(outScript)
                  .then( (doc) => {
                    window.showTextDocument(doc);
                  });
                }
              });
            }
          }
        } else {
          channel.show(true);
          if (config.showNotifications) window.showErrorMessage('Something went wrong. See the output for details.');
        }
      });
    })
    .catch(pathWarning);
  });
};

export { generate };
