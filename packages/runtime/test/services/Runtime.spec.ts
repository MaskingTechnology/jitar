
import { describe, expect, it } from 'vitest';

import { RUNTIMES } from '../_fixtures/services/Runtime.fixture';

const goodRuntime = RUNTIMES.GOOD;
const badRuntime = RUNTIMES.BAD;
const errorRuntime = RUNTIMES.ERROR;

describe('services/Runtime', () =>
{
    describe('.isHealthy', () =>
    {
        it('is unhealth with exception', async () =>
        {
            const isHealthy = await errorRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('is unhealth with bad health check', async () =>
        {
            const isHealthy = await badRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('is healthy with good health check', async () =>
        {
            const isHealthy = await goodRuntime.isHealthy();

            expect(isHealthy).toBeTruthy();
        });
    });

    describe('.getHealth', () =>
    {
        it('is unhealth with exception', async () =>
        {
            const health = await errorRuntime.getHealth();
            const result = health.get('error');

            expect(result).toBeFalsy();
        });

        it('is unhealth with bad health check', async () =>
        {
            const health = await badRuntime.getHealth();
            const result = health.get('bad');

            expect(result).toBeFalsy();
        });

        it('is healthy with good health check', async () =>
        {
            const health = await goodRuntime.getHealth();
            const result = health.get('good');

            expect(result).toBeTruthy();
        });
    });
});
