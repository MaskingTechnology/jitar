
import { describe, expect, it } from 'vitest';

import { RUNTIMES } from '../_fixtures/services/Runtime.fixture';

const goodRuntime = RUNTIMES.GOOD;
const badRuntime = RUNTIMES.BAD;
const errorRuntime = RUNTIMES.ERROR;
const timedOutRuntime = RUNTIMES.TIMEDOUT;
const inTimeRuntime = RUNTIMES.INTIME;

describe('services/Runtime', () =>
{
    describe('.isHealthy()', () =>
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

        it('is unhealthy with timed out health check', async () =>
        {
            const isHealthy = await timedOutRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('is healthy with in time health check', async () =>
        {
            const isHealthy = await inTimeRuntime.isHealthy();

            expect(isHealthy).toBeTruthy();
        });
    });

    describe('.getHealth()', () =>
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

        it('is unhealthy with timed out health check', async () =>
        {
            const health = await timedOutRuntime.getHealth();
            const result = health.get('timedOut');

            expect(result).toBeFalsy();
        });

        it('is healthy with in time health check', async () =>
        {
            const health = await inTimeRuntime.getHealth();
            const result = health.get('inTime');

            expect(result).toBeTruthy();
        });
    });
});
