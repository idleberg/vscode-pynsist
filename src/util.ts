'use strict';

// Dependencies
import * as opn from 'opn';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';
import { basename, dirname, extname, join } from 'path';
import { window, workspace } from 'vscode';

const clearOutput = (channel) => {
  let config: any = getConfig();

  channel.clear();
  if (config.alwaysShowOutput === true) {
    channel.show(true);
  }
};

const detectOutput = (relativePath, line, needle) => {
  if (line.indexOf(needle.string) !== -1) {
    let regex = needle.regex;
    let result = regex.exec(line.toString());
    let absolutePath = join(relativePath, result[1]);

    try {
      return (existsSync(absolutePath) === true) ? absolutePath : '';
    } catch (e) {
      return '';
    }
  }

  return '';
};

const getConfig = () => {
  return workspace.getConfiguration('pynsist');
};

const getPrefix = () => {
  if (platform() === 'win32') {
    return '/';
  }

  return '-';
};

const getPath = () => {
  return new Promise((resolve, reject) => {
    let pathToPynsist = getConfig().pathToPynsist;
    if (typeof pathToPynsist !== 'undefined' && pathToPynsist !== null && pathToPynsist !== '') {
      console.log('Using pynsist path found in user settings: ' + pathToPynsist);
      return resolve(pathToPynsist);
    }

    let which = spawn(this.which(), ['pynsist']);

    which.stdout.on('data', (data) => {
      console.log('Using pynsist path detected on file system: ' + data);
      return resolve(data);
    });

    which.on('close', (code) => {
      if (code !== 0) {
        return reject(code);
      }
    });
  });
};

const pathWarning = () => {
  window.showWarningMessage('pynsist is not installed or missing in your PATH environmental variable', 'Download', 'Help')
  .then((choice) => {
    switch (choice) {
      case 'Download':
        return opn('https://pypi.python.org/pypi/pynsist');
      case 'Help':
        return opn('http://superuser.com/a/284351/195953');
    }
  });
};

const runInstaller = (outFile) => {
  let config: any = getConfig();

  if (platform() === 'win32') {
    // Setting shell to true seems to prevent spawn UNKNOWN errors
    return spawn(outFile, [], { shell: true});
  } else if (config.useWineToRun === true) {
    return spawn('wine', [ outFile ]);
  }
};

const sanitize = (response: Object) => {
  return response.toString().trim();
};

const which = () => {
  if (platform() === 'win32') {
    return 'where';
  }
  return 'which';
};

export {
  clearOutput,
  detectOutput,
  getConfig,
  getPrefix,
  getPath,
  pathWarning,
  runInstaller,
  sanitize,
  which
};
