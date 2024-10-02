
import { describe, expect, it } from 'vitest';

import { Request, Version, ProcedureNotFound, RunModes } from '@jitar/execution';

import RequestNotTrusted from '../../src/worker/errors/RequestNotTrusted';

import { LOCAL_WORKERS, VALUES } from './fixtures';

describe('worker/LocalWorker', () =>
{
    describe('.run(request)', () =>
    {
        it('should run a public procedure ', async () =>
        {
            const worker = LOCAL_WORKERS.PUBLIC;

            const headers = new Map().set('x-jitar-trust-key', VALUES.TRUST_KEY);
            const request = new Request('public', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const response = await worker.run(request);

            expect(response.result).toBe('public');
        });

        it('should run a protected procedure with valid trust key', async () =>
        {
            const worker = LOCAL_WORKERS.PROTECTED;

            const headers = new Map().set('x-jitar-trust-key', VALUES.TRUST_KEY);
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const response = await worker.run(request);

            expect(response.result).toBe('protected');
        });
        
        it('should not run a non-existing procedure', async () =>
        {
            const worker = LOCAL_WORKERS.PROTECTED;

            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = worker.run(request);

            expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });

        it('should not run a protected procedure with invalid trust key', async () =>
        {
            const worker = LOCAL_WORKERS.PROTECTED;

            const headers = new Map().set('x-jitar-trust-key', 'invalid');
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const promise = worker.run(request);

            expect(promise).rejects.toEqual(new RequestNotTrusted());
        });

        it('should not run a protected procedure without trust key', async () =>
        {
            const worker = LOCAL_WORKERS.PROTECTED;

            const request = new Request('protected', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = worker.run(request);

            expect(promise).rejects.toEqual(new RequestNotTrusted());
        });

        // TODO: Add tests for remote execution

        // TODO: Add tests for (de)serialization
    });
});
