
import { describe, expect, it } from 'vitest';

import { Request, Version, ProcedureNotFound, RunModes } from '@jitar/execution';

import RequestNotTrusted from '../../src/worker/errors/RequestNotTrusted';

import { LOCAL_WORKERS, VALUES } from './fixtures';

const publicWorker = LOCAL_WORKERS.PUBLIC;
const protectedWorker = LOCAL_WORKERS.PROTECTED;

describe('worker/LocalWorker', () =>
{
    describe('.run(request)', () =>
    {
        it('should run a public procedure ', async () =>
        {
            const headers = new Map().set(VALUES.TRUST_KEY_HEADER, VALUES.TRUST_KEY);
            const request = new Request('public', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const response = await publicWorker.run(request);

            expect(response.result).toBe('public');
        });

        it('should run a protected procedure with valid trust key', async () =>
        {
            const headers = new Map().set(VALUES.TRUST_KEY_HEADER, VALUES.TRUST_KEY);
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const response = await protectedWorker.run(request);

            expect(response.result).toBe('protected');
        });
        
        it('should not run a non-existing procedure', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = protectedWorker.run(request);

            await expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });

        it('should not run a protected procedure with invalid trust key', async () =>
        {
            const headers = new Map().set(VALUES.TRUST_KEY_HEADER, 'invalid');
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const promise = protectedWorker.run(request);

            await expect(promise).rejects.toEqual(new RequestNotTrusted());
        });

        it('should not run a protected procedure without trust key', async () =>
        {
            const request = new Request('protected', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = protectedWorker.run(request);

            await expect(promise).rejects.toEqual(new RequestNotTrusted());
        });

        // TODO: Add tests for remote execution

        // TODO: Add tests for (de)serialization

        // TODO: Add tests for states
    });
});
