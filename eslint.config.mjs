import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config'
import tsparser from '@typescript-eslint/parser';
import jitar from 'eslint-plugin-jitar';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    sonarjs.configs.recommended,
    {
        ignores: [
            "**/dist/**/*",
            "**/node_modules/**/*",
            "**/coverage/**/*",
            "**/templates/**/*",
            "**/test/**/fixtures/**/*",
            "*config*"
        ]
    },
    {
        languageOptions: {
            parser: tsparser
        },
        plugins: {
            'jitar': jitar
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "semi": ["error", "always"],
            "eol-last": ["error", "always"],
            "brace-style": ["error", "allman", { "allowSingleLine": true }],
            "jitar/empty-first-line": "error",

            "sonarjs/todo-tag": "off",
            "sonarjs/slow-regex": "off",
            "sonarjs/duplicates-in-character-class": "off"
        }
    }
);