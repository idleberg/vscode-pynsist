import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	entry: ['src/index.ts'],
	external: ['vscode'],
	format: 'cjs',
	inlineOnly: false,
	minify: true,
	noExternal: ['open', 'vscode-get-config', 'which'],
	outDir: 'lib',
	platform: 'node',
	target: 'es2020',
	treeshake: true,
});
