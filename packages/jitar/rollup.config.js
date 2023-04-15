import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import dts from "rollup-plugin-dts";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

export default [
	{
		input: 'dist/client.js',
		output: [
			{
				file: 'lib/client.js',
				format: 'module',
				plugins: [terser()]
			}
		],
		plugins: [json(), nodeResolve()]
	},
	{
		input: 'dist/client.d.ts',
		output: [
			{
				file: 'lib/client.d.ts',
				format: 'module'
			}
		],
		plugins: [dts()]
	}
]