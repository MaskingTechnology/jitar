
import { describe, expect, it } from 'vitest';

import ProcedureNotFound from '../../src/errors/ProcedureNotFound';
import InvalidTrustKey from '../../src/errors/InvalidTrustKey';
import Request from '../../src/models/Request';
import Version from '../../src/models/Version';

import { GATEWAYS, GATEWAY_URL } from '../_fixtures/services/LocalGateway.fixture';

const gateway = GATEWAYS.STANDALONE;

describe('services/LocalGateway', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(gateway.url).toContain(GATEWAY_URL);
        });
    });

    describe('.getProcedureNames()', () =>
    {
        it('should contain all public and protected procedure names', () =>
        {
            const procedureNames = gateway.getProcedureNames();

            expect(procedureNames).toHaveLength(6);
            expect(procedureNames).toContain('protected');
            expect(procedureNames).toContain('public');
            expect(procedureNames).toContain('second');
            expect(procedureNames).toContain('third');
            expect(procedureNames).toContain('fourth');
            expect(procedureNames).toContain('sixth');
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should have public procedures', () =>
        {
            const hasProtectedProcedure = gateway.hasProcedure('protected');
            const hasPublicProcedure = gateway.hasProcedure('public');
            const hasSecondProcedure = gateway.hasProcedure('second');
            const hasThirdProcedure = gateway.hasProcedure('third');
            const hasFourthProcedure = gateway.hasProcedure('fourth');
            const hasSixthProcedure = gateway.hasProcedure('sixth');

            expect(hasProtectedProcedure).toBeTruthy();
            expect(hasPublicProcedure).toBeTruthy();
            expect(hasSecondProcedure).toBeTruthy();
            expect(hasThirdProcedure).toBeTruthy();
            expect(hasFourthProcedure).toBeTruthy();
            expect(hasSixthProcedure).toBeTruthy();
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should find and run a procedure from a worker', async () =>
        {
            const request = new Request('second', Version.DEFAULT, new Map(), new Map());
            const response = await gateway.run(request);

            expect(response.result).toBe('first');
        });

        it('should find and run a procedure from a worker that calls a procedure on another worker', async () =>
        {
            const request = new Request('third', Version.DEFAULT, new Map(), new Map());
            const response = await gateway.run(request);

            expect(response.result).toBe('fourth');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map());
            const run = async () => gateway.run(request);

            expect(run).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });
    });

    describe('.addWorker(worker, accessKey)', () =>
    {
        it('should not add a worker with an incorrect access key', async () =>
        {
            const worker = gateway.workers[0];
            const protectedGateway = GATEWAYS.PROTECTED;

            const addWorker = async () => protectedGateway.addWorker(worker, 'INCORRECT_ACCESS_KEY');

            expect(addWorker).rejects.toEqual(new InvalidTrustKey());
        });

        it('should not add a worker with an access key to an unprotected gateway', async () =>
        {
            const worker = gateway.workers[0];
            const unprotectedGateway = GATEWAYS.STANDALONE;

            const addWorker = async () => unprotectedGateway.addWorker(worker, 'WORKER_ACCESS_KEY');

            expect(addWorker).rejects.toEqual(new InvalidTrustKey());
        });
    });
});
