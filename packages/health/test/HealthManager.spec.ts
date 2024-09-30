
import { describe, expect, it } from 'vitest';

import { HEALTH_MANAGERS } from './fixtures';

describe('services/LocalWorker', () =>
{
    describe('.isHealthy()', () =>
    {
        it('should be unhealthy when an error occurs', async () =>
        {
            const isHealthy = await HEALTH_MANAGERS.ERROR.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be unhealthy with a bad health check', async () =>
        {
            const isHealthy = await HEALTH_MANAGERS.BAD.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with a good health check', async () =>
        {
            const isHealthy = await HEALTH_MANAGERS.GOOD.isHealthy();

            expect(isHealthy).toBeTruthy();
        });

        it('should be unhealthy with a timed out health check', async () =>
        {
            const isHealthy = await HEALTH_MANAGERS.TIMEDOUT.isHealthy();

            expect(isHealthy).toBeFalsy();
        });

        it('should be healthy with an in time health check', async () =>
        {
            const isHealthy = await HEALTH_MANAGERS.INTIME.isHealthy();

            expect(isHealthy).toBeTruthy();
        });
    });

    describe('.getHealth()', () =>
    {
        it('should get a false state when an error occurs', async () =>
        {
            const health = await HEALTH_MANAGERS.ERROR.getHealth();
            const result = health.get('error');

            expect(result).toBeFalsy();
        });

        it('should get a false state with a bad health check', async () =>
        {
            const health = await HEALTH_MANAGERS.BAD.getHealth();
            const result = health.get('bad');

            expect(result).toBeFalsy();
        });

        it('should get a true state with a good health check', async () =>
        {
            const health = await HEALTH_MANAGERS.GOOD.getHealth();
            const result = health.get('good');

            expect(result).toBeTruthy();
        });

        it('should get a false state with a timed out health check', async () =>
        {
            const health = await HEALTH_MANAGERS.TIMEDOUT.getHealth();
            const result = health.get('timedOut');

            expect(result).toBeFalsy();
        });

        it('should get a true state with an in time health check', async () =>
        {
            const health = await HEALTH_MANAGERS.INTIME.getHealth();
            const result = health.get('inTime');

            expect(result).toBeTruthy();
        });
    });
});
