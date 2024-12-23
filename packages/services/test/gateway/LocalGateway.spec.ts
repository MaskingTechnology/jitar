
import { describe, expect, it } from 'vitest';

import InvalidTrustKey from '../../src/gateway/errors/InvalidTrustKey';

import { LOCAL_GATEWAYS, REMOTE_WORKERS } from './fixtures';

const publicGateway = LOCAL_GATEWAYS.PUBLIC;
const protectedGateway = LOCAL_GATEWAYS.PROTECTED;

const emptyWorker = REMOTE_WORKERS.EMPTY;
const trustedWorker = REMOTE_WORKERS.TRUSTED;
const untrustedWorker = REMOTE_WORKERS.UNTRUSTED;

describe('gateway/LocalGateway', () =>
{
    describe('.addWorker(worker, trustKey?)', () =>
    {
        it('should add a worker without a trust key to a public gateway', async () =>
            {
                const promise = publicGateway.addWorker(emptyWorker);
    
                await expect(promise).resolves.toBeDefined();
            });

        it('should add a worker with a valid trust key to a protected gateway', async () =>
        {
            const promise = protectedGateway.addWorker(trustedWorker);

            await expect(promise).resolves.toBeDefined();
        });

        it('should not add a worker with an invalid trust key to a protected gateway', async () =>
        {
            const promise = protectedGateway.addWorker(untrustedWorker);

            await expect(promise).rejects.toEqual(new InvalidTrustKey());
        });

        it('should not add a worker with a missing trust key to a protected gateway', async () =>
        {
            const promise = protectedGateway.addWorker(emptyWorker);

            await expect(promise).rejects.toEqual(new InvalidTrustKey());
        });
    });
});
