
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import { SERVER_EXTERNALS } from './rollup.definitions.js';

function bundle(input, output, supportBrowser) {
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
	}
}

function type(input, output) {
	return {
		input,
		output: [{ file: output, format: 'module' }],
		plugins: [dts({ respectExternal: true })],
	};
}

export default [
	bundle(['src/cli.ts', 'src/lib.ts'], { dir: 'dist' }, false),
	bundle('src/client.ts', { file: 'dist/client.js' }, true),
	type('./dist/types/lib.d.ts', 'dist/lib.d.ts')
];
