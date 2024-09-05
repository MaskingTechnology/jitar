
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import { SERVER_EXTERNALS } from './rollup.definitions.js';

export default [
	{
		external: SERVER_EXTERNALS,
		input: {
			cli: 'src/cli.ts',
			lib: 'src/lib.ts'
		},
		output: {
			dir: 'dist',
			exports: 'named',
			format: 'module',
			plugins: [terser({
				module: true,
				mangle: false
			})]
		},
		plugins: [
			typescript(),
			nodeResolve()
		]
	}
]
