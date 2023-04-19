
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
	{
		input: 'src/client.ts',
		output: {
			banner: '/* Jitar client v0.4.0 | (c) Masking Technology B.V. | https://github.com/MaskingTechnology/jitar/blob/main/LICENCE */',
			file: 'dist/client.js',
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
		input: 'src/server.ts',
		output: {
			banner: '/* Jitar server v0.4.0 | (c) Masking Technology B.V. | https://github.com/MaskingTechnology/jitar/blob/main/LICENCE */',
			file: 'dist/server.js',
			format: 'module',
			plugins: [terser()]
		},
		plugins: [typescript({
			tsconfig: './tsconfig.json',
			declaration: true,
			declarationDir: './dist/dts',
			outDir: './dist',
			rootDir: './src'
		  }), json(), nodeResolve()]
	},
	{
		input: './dist/dts/lib.d.ts',
	 	output: [{ file: 'dist/lib.d.ts', format: 'module' }],
	 	plugins: [dts({
			respectExternal: true
		})],
	},
]
