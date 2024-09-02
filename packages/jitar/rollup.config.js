
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';

import { SERVER_EXTERNALS, REPLACE_VALUES } from './rollup.definitions.js';

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
			replace({
				preventAssignment: true,
				values: REPLACE_VALUES
			}),
			nodeResolve()
		]
	},
	{
		input: './dist/types/lib.d.ts',
	 	output: [{ file: 'dist/lib.d.ts', format: 'module' }],
	 	plugins: [dts({
			respectExternal: true
		})],
	}
]
