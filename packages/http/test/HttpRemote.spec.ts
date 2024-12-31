
import { describe, expect, it } from 'vitest';

import { HttpRemote } from '../src';
import InvalidWorkerId from '../src/errors/InvalidWorkerId';

import { dummyFetch, VALUES } from './fixtures';

describe('HttpRemote', () =>
{
    describe('provide', () =>
    {
        const remote = new HttpRemote(VALUES.REMOTE.DUMMY, dummyFetch);

        it('should provide a file with actual content type', async () =>
        {
            const file = await remote.provide(VALUES.INPUT.FILE_WITH_CONTENT_TYPE);

            expect(file).toBeDefined();
            expect(file.location).toBe(VALUES.OUTPUT.FILE_WITH_CONTENT_TYPE.location);
            expect(file.type).toBe(VALUES.OUTPUT.FILE_WITH_CONTENT_TYPE.type);
        });

        it('should provide a file with default content type', async () =>
        {
            const file = await remote.provide(VALUES.INPUT.FILE_WITH_DEFAULT_CONTENT_TYPE);

            expect(file).toBeDefined();
            expect(file.location).toBe(VALUES.OUTPUT.FILE_WITH_DEFAULT_CONTENT_TYPE.location);
            expect(file.type).toBe(VALUES.OUTPUT.FILE_WITH_DEFAULT_CONTENT_TYPE.type);
        });
    });

    describe('isHealthy', () =>
    {
        it('should return true when the server is healthy', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.IS_HEALTHY, dummyFetch);
            const healthy = await remote.isHealthy();

            expect(healthy).toBe(true);
        });

        it('should return false when the server is unhealthy', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.IS_UNHEALTHY, dummyFetch);
            const healthy = await remote.isHealthy();

            expect(healthy).toBe(false);
        });
    });

    describe('getHealth', () =>
    {
        it('should return health status per health check', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.DUMMY, dummyFetch);
            const health = await remote.getHealth();

            expect(health).toBeDefined();
            expect(health.get(VALUES.OUTPUT.GET_HEALTH.database.key)).toBe(VALUES.OUTPUT.GET_HEALTH.database.value);
            expect(health.get(VALUES.OUTPUT.GET_HEALTH.filestore.key)).toBe(VALUES.OUTPUT.GET_HEALTH.filestore.value);
        });
    });

    describe('addWorker', () =>
    {
        it('should add a worker with a valid response', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.ADD_WORKER_VALID, dummyFetch);
            const id = await remote.addWorker(VALUES.INPUT.ADD_WORKER, []);

            expect(id).toBe(VALUES.OUTPUT.ADD_WORKER_VALID);
        });

        it('should reject when the response id is not valid', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.ADD_WORKER_INVALID_ID, dummyFetch);
            const promise = remote.addWorker(VALUES.INPUT.ADD_WORKER, []);

            await expect(promise).rejects.toThrowError(InvalidWorkerId);
        });

        it('should reject when the response type is not valid', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.ADD_WORKER_INVALID_REQUEST, dummyFetch);
            const promise = remote.addWorker(VALUES.INPUT.ADD_WORKER, []);

            await expect(promise).rejects.toThrowError(InvalidWorkerId);
        });
    });

    describe('run', () =>
    {
        it('should run a valid request', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.DUMMY, dummyFetch);
            const response = await remote.run(VALUES.INPUT.RUN_VALID);

            expect(response).toBeDefined();
            expect(response.status).toBe(VALUES.OUTPUT.RUN_VALID.status);
            expect(response.result).toBe(VALUES.OUTPUT.RUN_VALID.result);
        });

        it('should run an invalid request', async () =>
        {
            const remote = new HttpRemote(VALUES.REMOTE.DUMMY, dummyFetch);
            const response =  await remote.run(VALUES.INPUT.RUN_BAD_REQUEST);

            expect(response).toBeDefined();
            expect(response.status).toBe(VALUES.OUTPUT.RUN_BAD_REQUEST.status);
            expect(response.result).toBe(VALUES.OUTPUT.RUN_BAD_REQUEST.result);
        });
    });
});
