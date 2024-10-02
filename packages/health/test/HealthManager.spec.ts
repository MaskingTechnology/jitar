
import { describe, expect, it } from 'vitest';

import { HEALTH_MANAGERS } from './fixtures';

const errorManager = HEALTH_MANAGERS.ERROR;
const badManager = HEALTH_MANAGERS.BAD;
const goodManager = HEALTH_MANAGERS.GOOD;
const timedOutManager = HEALTH_MANAGERS.TIMEDOUT;
const inTimeManager = HEALTH_MANAGERS.INTIME;

describe('HealthManager', () =>
{
    describe('.isHealthy()', () =>
    {
        it('should be unhealthy when an error occurs', async () =>
        {
            const isHealthy = await errorManager.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be unhealthy with a bad health check', async () =>
        {
            const isHealthy = await badManager.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with a good health check', async () =>
        {
            const isHealthy = await goodManager.isHealthy();

            expect(isHealthy).toBeTruthy();
        });

        it('should be unhealthy with a timed out health check', async () =>
        {
            const isHealthy = await timedOutManager.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with an in time health check', async () =>
        {
            const isHealthy = await inTimeManager.isHealthy();

            expect(isHealthy).toBeTruthy();
        });
    });

    describe('.getHealth()', () =>
    {
        it('should get a false state when an error occurs', async () =>
        {
            const health = await errorManager.getHealth();
            const result = health.get('error');

            expect(result).toBeFalsy();
        });

        it('should get a false state with a bad health check', async () =>
        {
            const health = await badManager.getHealth();
            const result = health.get('bad');

            expect(result).toBeFalsy();
        });

        it('should get a true state with a good health check', async () =>
        {
            const health = await goodManager.getHealth();
            const result = health.get('good');

            expect(result).toBeTruthy();
        });

        it('should get a false state with a timed out health check', async () =>
        {
            const health = await timedOutManager.getHealth();
            const result = health.get('timedOut');

            expect(result).toBeFalsy();
        });

        it('should get a true state with an in time health check', async () =>
        {
            const health = await inTimeManager.getHealth();
            const result = health.get('inTime');

            expect(result).toBeTruthy();
        });
    });
});
