
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import { SERVER_EXTERNALS } from './rollup.definitions.js';

function bundle(input, output, supportBrowser)
{
	return {
		external: SERVER_EXTERNALS,
		treeshake: {
			moduleSideEffects: false
		},
		input,
		output: {
			...output,
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
	bundle(['src/cli.ts', 'src/lib.ts'], { dir: 'dist' }, false),
	bundle('src/lib.ts', { file: 'dist/client.js' }, true)
];
