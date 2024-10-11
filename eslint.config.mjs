import eslint from '@eslint/js';
import tsparser from '@typescript-eslint/parser';
import jitar from 'eslint-plugin-jitar';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import nx from '@nx/eslint-plugin';

export default tseslint.config({
    ignores: [
        "**/dist/**/*",
        "**/node_modules/**/*",
        "**/coverage/**/*",
        "**/templates/**/*",
        "*config*"
    ],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        sonarjs.configs.recommended,
    ],
    languageOptions: {
        parser: tsparser
    },
    plugins: {
        'jitar': jitar,
        '@nx': nx
    },
    rules: {
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@nx/enforce-module-boundaries": ["error",
          {
            depConstraints: [
                {
                    sourceTag: '@jitar/analysis',
                    onlyDependOnLibsWithTags: []
                },
                {
                    sourceTag: '@jitar/errors',
                    onlyDependOnLibsWithTags: []
                },
                {
                    sourceTag: '@jitar/logging',
                    onlyDependOnLibsWithTags: []
                },
                {
                    sourceTag: '@jitar/sourcing',
                    onlyDependOnLibsWithTags: []
                },
                {
                    sourceTag: '@jitar/execution',
                    onlyDependOnLibsWithTags: ['@jitar/errors']
                },
                {
                    sourceTag: '@jitar/health',
                    onlyDependOnLibsWithTags: ['@jitar/errors']
                },
                {
                    sourceTag: '@jitar/serialization',
                    onlyDependOnLibsWithTags: ['@jitar/analysis']  
                },
                {
                    sourceTag: '@jitar/validation',
                    onlyDependOnLibsWithTags: ['@jitar/errors', '@jitar/execution']
                },
                {
                    sourceTag: '@jitar/middleware',
                    onlyDependOnLibsWithTags: ['@jitar/errors', '@jitar/execution']
                },
                {
                    sourceTag: '@jitar/configuration',
                    onlyDependOnLibsWithTags: ['@jitar/sourcing', '@jitar/validation']
                },
                {
                    sourceTag: '@jitar/services',
                    onlyDependOnLibsWithTags: ['@jitar/errors', '@jitar/execution', '@jitar/serialization', '@jitar/sourcing']
                },
                {
                    sourceTag: '@jitar/build',
                    onlyDependOnLibsWithTags: ['@jitar/analysis', '@jitar/configuration', '@jitar/execution' ,'@jitar/logging', '@jitar/sourcing']
                },
                {
                    sourceTag: '@jitar/runtime',
                    onlyDependOnLibsWithTags: ['@jitar/configuration', '@jitar/errors', '@jitar/execution', '@jitar/health', '@jitar/logging', '@jitar/middleware', '@jitar/services', '@jitar/sourcing']
                },
                {
                    sourceTag: '@jitar/http',
                    onlyDependOnLibsWithTags: ['@jitar/execution', '@jitar/middleware', '@jitar/runtime', '@jitar/services', '@jitar/sourcing', '@jitar/validation']
                },
                {
                    sourceTag: '@jitar/cli',
                    onlyDependOnLibsWithTags: ['@jitar/build', '@jitar/configuration', '@jitar/http', '@jitar/logging', '@jitar/runtime', '@jitar/sourcing']
                },
                {
                    sourceTag: 'jitar',
                    onlyDependOnLibsWithTags: ['@jitar/cli', '@jitar/errors', '@jitar/execution', '@jitar/health', '@jitar/http', '@jitar/logging', '@jitar/middleware', '@jitar/runtime']
                }
              ]
          }
        ],
        "no-return-await": "error",
        "semi": ["error", "always"],
        "eol-last": ["error", "always"],
        "brace-style": ["error", "allman", { "allowSingleLine": true }],
        "jitar/empty-first-line": "error",

        "sonarjs/todo-tag": "off",
        "sonarjs/slow-regex": "off",
        "sonarjs/duplicates-in-character-class": "off"
    }
});