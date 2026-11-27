// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Enables the Temporal API on Node.js versions that ship it behind a flag
        execArgv: ['--harmony-temporal'],
        coverage: {
            provider: 'v8'
        },
    },
});
