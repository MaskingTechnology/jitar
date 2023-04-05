import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [
	{
		external: [ 'node:fs', 'node:path', 'node:url', 'minimist', 'prompts', 'kolorist' ],
		input: 'dist/index.js',
		output: [
			{
				file: 'lib/index.js',
				format: 'esm',
				plugins: [terser()]
			}
		],
		plugins: [json()]
	}
]