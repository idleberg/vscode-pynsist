// Dependencies
import { constants, promises as fs } from 'fs';
import { getConfig } from 'vscode-get-config';
import { join } from 'path';
import { platform } from 'os';
import { spawn } from 'child_process';
import { window, type OutputChannel } from 'vscode';
import open from 'open';

async function clearOutput(channel: OutputChannel): Promise<void> {
  const { alwaysShowOutput } = await getConfig('pynsist');

  channel.clear();
  if (alwaysShowOutput === true) {
    channel.show(true);
  }
}

async function detectOutput(relativePath: string, line: string, needle: DetectOutputOptions): Promise<string> {
  if (line.includes(needle.string)) {
    const regex = needle.regex;
    const result = regex.exec(line.toString());
    const absolutePath = join(relativePath, result[1]);

    return (await fileExists(absolutePath))
      ? absolutePath
      : '';
  }

  return '';
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, constants.F_OK);
  } catch (_err) {
    return false;
  }

  return true;
}


function getPrefix(): string {
  return platform() === 'win32'
    ? '/'
    : '-';
}

async function getPath(): Promise<string | number> {
  const pathToPynsist = await getConfig('pynsist.pathToPynsist') || 'pynsist';

  return new Promise((resolve, reject) => {
    if (pathToPynsist) {
      console.log('Using pynsist path found in user settings: ' + pathToPynsist);
      return resolve(pathToPynsist);
    }

    const which = spawn(this.which(), ['pynsist']);

    which.stdout.on('data', (data) => {
      console.log('Using pynsist path detected on file system: ' + data);
      return resolve(data);
    });

    which.on('error', (errorMessage) => {
      console.error({errorMessage: errorMessage});
    });

    which.on('close', (code) => {
      if (code !== 0) {
        return reject(code);
      }
    });
  });
}

function pathWarning(): void {
  window.showWarningMessage('pynsist is not installed or missing in your PATH environment variable', 'Download', 'Help')
  .then((choice) => {
    switch (choice) {
      case 'Download':
        open('https://pypi.python.org/pypi/pynsist');
        break;

      case 'Help':
        open('http://superuser.com/a/284351/195953');
        break;
    }
  });
}

async function runInstaller(outFile: string): Promise<void> {
  const { useWineToRun } = getConfig('pynsist');

  if (platform() === 'win32') {
    // Setting shell to true seems to prevent spawn UNKNOWN errors
    spawn(outFile, [], { shell: true});
  } else if (useWineToRun === true) {
    spawn('wine', [ outFile ]);
  }
}

function sanitize(response: unknown): string {
  return response.toString().trim();
}

function which(): string {
  return platform() === 'win32'
    ? 'where'
    : 'which';
}

export {
  clearOutput,
  detectOutput,
  getPrefix,
  getPath,
  pathWarning,
  runInstaller,
  sanitize,
  which
};
