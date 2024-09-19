
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import { SERVER_EXTERNALS } from './rollup.definitions.js';

function bundle(inputFile, outputFile, supportBrowser)
{
	return {
		external: SERVER_EXTERNALS,
		treeshake: {
			moduleSideEffects: false
		},
		input: inputFile,
		output: {
			file: outputFile,
			exports: 'named',
			format: 'module',
			plugins: [terser({
				module: true,
				mangle: false
			})]
		},
		plugins: [
			typescript(),
			nodeResolve({
				browser: supportBrowser
			})
		]
	};
}

export default [
	bundle('src/cli.ts', 'dist/cli.js', false),
	bundle('src/lib.ts', 'dist/lib.js', true)
];
