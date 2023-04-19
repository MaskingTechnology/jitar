
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
	{
		input: 'dist/client.js',
		output: {
			banner: '/* Jitar client v0.4.0 | (c) Masking Technology B.V. | https://github.com/MaskingTechnology/jitar/blob/main/LICENCE */',
			file: 'lib/client.js',
			format: 'module',
			plugins: [terser()]
		},
		plugins: [typescript(), json(), nodeResolve()]
	},
    {
		external: [
			'class-transformer',
			'class-validator',
			'express',
			'express-http-proxy',
			'fs-extra',
			'glob-promise',
			'mime-types',
			'tslog',
			'yargs',
			'zod'
		],
		input: 'dist/lib.js',
		output: {
			banner: '/* Jitar server v0.4.0 | (c) Masking Technology B.V. | https://github.com/MaskingTechnology/jitar/blob/main/LICENCE */',
			file: 'lib/server.js',
			format: 'module',
			plugins: [terser()]
		},
		plugins: [typescript(), json(), nodeResolve()]
	},
	{
		input: './lib/dist/dts/lib.d.ts',
		output: [{ file: 'lib/index.d.ts', format: 'es' }],
		plugins: [dts()],
	},
]
