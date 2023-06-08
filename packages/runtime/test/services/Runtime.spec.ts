
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
        it('should be unhealthy when an error occurs', async () =>
        {
            const isHealthy = await errorRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be unhealthy with a bad health check', async () =>
        {
            const isHealthy = await badRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with a good health check', async () =>
        {
            const isHealthy = await goodRuntime.isHealthy();

            expect(isHealthy).toBeTruthy();
        });

        it('should be unhealthy with a timed out health check', async () =>
        {
            const isHealthy = await timedOutRuntime.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with an in time health check', async () =>
        {
            const isHealthy = await inTimeRuntime.isHealthy();

            expect(isHealthy).toBeTruthy();
        });
    });

    describe('.getHealth()', () =>
    {
        it('should get a false state when an error occurs', async () =>
        {
            const health = await errorRuntime.getHealth();
            const result = health.get('error');

            expect(result).toBeFalsy();
        });

        it('should get false state with a bad health check', async () =>
        {
            const health = await badRuntime.getHealth();
            const result = health.get('bad');

            expect(result).toBeFalsy();
        });

        it('should get a true state with a good health check', async () =>
        {
            const health = await goodRuntime.getHealth();
            const result = health.get('good');

            expect(result).toBeTruthy();
        });

        it('should get false state with a timed out health check', async () =>
        {
            const health = await timedOutRuntime.getHealth();
            const result = health.get('timedOut');

            expect(result).toBeFalsy();
        });

        it('should get true state with an in time health check', async () =>
        {
            const health = await inTimeRuntime.getHealth();
            const result = health.get('inTime');

            expect(result).toBeTruthy();
        });
    });
});
