import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import dts from "rollup-plugin-dts";

export default [
	{
		external: [ 'jitar-runtime', 'jitar-reflection' ],
		input: 'dist/lib.js',
		output: [
			{
				file: 'lib/index.js',
				format: 'esm',
				plugins: [terser()]
			}
		],
		plugins: [json()]
	},
	{
		
		input: 'dist/lib.d.ts',
		output: [
			{
				file: 'lib/index.d.ts',
				format: 'esm'
			}
		],
		plugins: [dts()]
	}
]