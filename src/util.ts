import { spawn } from 'node:child_process';
import { constants, promises as fs } from 'node:fs';
import { platform } from 'node:os';
import { join } from 'node:path';
import open from 'open';
import { type OutputChannel, window } from 'vscode';
import { getConfig } from 'vscode-get-config';

export async function clearOutput(channel: OutputChannel): Promise<void> {
	const { alwaysShowOutput } = await getConfig('pynsist');

	channel.clear();
	if (alwaysShowOutput === true) {
		channel.show();
	}
}

export async function detectOutput(relativePath: string, line: string, needle: DetectOutputOptions): Promise<string> {
	if (line.includes(needle.string)) {
		const regex = needle.regex;
		const result = regex.exec(line.toString());

		if (!result) {
			return '';
		}

		const absolutePath = join(relativePath, result[1] || '');

		return (await fileExists(absolutePath)) ? absolutePath : '';
	}

	return '';
}

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath, constants.F_OK);
	} catch (error) {
		console.error(`[vscode-pynsist] ${(error as Error).message}`);
		return false;
	}

	return true;
}

export function getPrefix(): string {
	return platform() === 'win32' ? '/' : '-';
}

export async function getPath(): Promise<string | number> {
	const pathToPynsist = (await getConfig<string>('pynsist.pathToPynsist'))?.toString().trim();

	return new Promise((resolve, reject) => {
		if (pathToPynsist) {
			console.log(`Using pynsist path found in user settings: ${pathToPynsist}`);
			return resolve(pathToPynsist);
		}

		const cp = spawn('pynsist');

		cp.stdout.on('data', (data) => {
			console.log(`Using pynsist path detected on file system: ${data}`);
			return resolve(data);
		});

		cp.on('error', (errorMessage) => {
			console.error({ errorMessage: errorMessage });
		});

		cp.on('close', (code) => {
			if (code !== 0) {
				return reject(code);
			}
		});
	});
}

export function pathWarning(): void {
	window
		.showWarningMessage('pynsist is not installed or missing in your PATH environment variable', 'Download', 'Help')
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

export async function runInstaller(outFile: string): Promise<void> {
	const { useWineToRun } = await getConfig('pynsist');

	if (platform() === 'win32') {
		// Setting shell to true seems to prevent spawn UNKNOWN errors
		spawn(outFile, [], { shell: true });
	} else if (useWineToRun === true) {
		spawn('wine', [outFile]);
	}
}

export function sanitize(response: string): string {
	return response.toString().trim();
}
