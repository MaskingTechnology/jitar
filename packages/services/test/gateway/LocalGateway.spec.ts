
import { describe, expect, it } from 'vitest';

import InvalidTrustKey from '../../src/gateway/errors/InvalidTrustKey';

import { LOCAL_GATEWAYS, REMOTE_WORKERS, VALUES } from './fixtures';

describe('gateway/LocalGateway', () =>
{
    describe('.addWorker(worker, trustKey?)', () =>
    {
        it('should add a worker without a trust key to a public gateway', () =>
            {
                const gateway = LOCAL_GATEWAYS.PUBLIC;
                const worker = REMOTE_WORKERS.EMPTY;
    
                const promise = gateway.addWorker(worker);
    
                expect(promise).resolves.toBeUndefined();
            });

        it('should add a worker with a valid trust key to a protected gateway', () =>
        {
            const gateway = LOCAL_GATEWAYS.PROTECTED;
            const worker = REMOTE_WORKERS.EMPTY;

            const promise = gateway.addWorker(worker, VALUES.TRUST_KEY);

            expect(promise).resolves.toBeUndefined();
        });

        it('should not add a worker with an invalid trust key to a protected gateway', () =>
        {
            const gateway = LOCAL_GATEWAYS.PROTECTED;
            const worker = REMOTE_WORKERS.EMPTY;

            const promise = gateway.addWorker(worker, 'INCORRECT_ACCESS_KEY');

            expect(promise).rejects.toEqual(new InvalidTrustKey());
        });

        it('should not add a worker with a missing trust key to a protected gateway', () =>
        {
            const gateway = LOCAL_GATEWAYS.PROTECTED;
            const worker = REMOTE_WORKERS.EMPTY;

            const promise = gateway.addWorker(worker);

            expect(promise).rejects.toEqual(new InvalidTrustKey());
        });
    });
});
