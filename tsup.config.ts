import { defineConfig } from 'tsup';

export default defineConfig({
	bundle: true,
	cjsInterop: true,
	clean: true,
	entry: ['src/index.ts'],
	external: ['vscode'],
	format: 'cjs',
	minify: true,
	noExternal: ['open', 'vscode-get-config', 'which'],
	outDir: 'lib',
	platform: 'node',
	target: 'es2020',
	treeshake: true,
});
