import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import dts from "rollup-plugin-dts";

export default [
	{
		external: [ 
			'jitar', 
			'@overnightjs/core',
			'class-transformer',
			'class-validator',
			'express',
			'express-http-proxy',
			'fs-extra',
			'glob-promise',
			'mime-types',
			'tslog',
			'yargs',
			'body-parser',
			'fs',
			'path',
			'url'
		],
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