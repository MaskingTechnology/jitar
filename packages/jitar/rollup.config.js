
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';

export default [
	{
		input: 'src/errors.ts',
		output: {
			file: 'dist/errors.js',
			format: 'module'
		},
		plugins: [typescript(), nodeResolve()]
	},
    {
		external: [
			'@jitar/errors'
		],
		input: 'src/client.ts',
		output: {
			file: 'build/client.js',
			format: 'module'
		},
		plugins: [
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
				declarationDir: './build/types',
				outDir: './dist',
				rootDir: './src'
		  	}),
			nodeResolve()]
	},
	{
		external: [
			'@jitar/errors',
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
			file: 'build/server.js',
			format: 'module'
		},
		plugins: [
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
				declarationDir: './build/types',
				outDir: './dist',
				rootDir: './src'
		  	}),
			nodeResolve()
		]
	},
	{
		external: [
			'./errors.js',
			'express',
			'express-http-proxy',
			'fs-extra',
			'glob-promise',
			'mime-types',
			'tslog',
			'yargs',
			'zod'
		],
		input: {
			client: 'build/client.js',
			server: 'build/server.js'
		},
		output: {
			dir: 'dist',
			exports: 'named',
			format: 'module',
			plugins: [
				terser()
			]
		},
		plugins: [
			replace({
				values: {
					'@jitar/errors': './errors.js'
				},
				preventAssignment: true,
				delimiters: ['', '']
			}),
			nodeResolve()
		]
	},
	{
		input: './build/types/lib.d.ts',
	 	output: [{ file: 'dist/lib.d.ts', format: 'module' }],
	 	plugins: [dts({
			respectExternal: true
		})],
	},
]
