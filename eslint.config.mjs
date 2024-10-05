import eslint from '@eslint/js';
import tsparser from '@typescript-eslint/parser';
import jitar from 'eslint-plugin-jitar';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    ignores: [
        "**/dist/**/*",
        "**/node_modules/**/*",
        "**/coverage/**/*",
        "packages/create-jitar/templates/*"
    ],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strict,
        ...tseslint.configs.stylistic,
        sonarjs.configs.recommended,
    ],
    languageOptions: {
        parser: tsparser,
    },
    plugins: {
        'jitar': jitar
    },
    rules: {
        "@typescript-eslint/ban-types": "off",
        "no-return-await": "error",
        "semi": ["error", "always"],
        "eol-last": ["error", "always"],
        "brace-style": ["error", "allman", { "allowSingleLine": true }],
        "jitar/empty-first-line": "error",
    }
});