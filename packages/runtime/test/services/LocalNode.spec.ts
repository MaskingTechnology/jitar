
import { describe, expect, it } from 'vitest';

import ProcedureNotFound from '../../src/errors/ProcedureNotFound';
import Request from '../../src/models/Request';
import Version from '../../src/models/Version';

import { NODES } from '../_fixtures/services/LocalNode.fixture';

const node = NODES.SINGLE;

describe('services/LocalNode', () =>
{
    describe('.isHealthy()', () =>
    {
        it('should be healthy', async () =>
        {
            const healthy = await node.isHealthy();

            expect(healthy).toBeTruthy();
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should find public procedures', () =>
        {
            const hasSecondProcedure = node.hasProcedure('second');
            const hasThirdProcedure = node.hasProcedure('third');

            expect(hasSecondProcedure).toBeTruthy();
            expect(hasThirdProcedure).toBeTruthy();
        });

        it('should not find private procedures', () =>
        {
            const hasPrivateProcedure = node.hasProcedure('private');
            const hasFirstProcedure = node.hasProcedure('first');

            expect(hasPrivateProcedure).toBeFalsy();
            expect(hasFirstProcedure).toBeFalsy();
        });

        it('should not find non-existing procedures', () =>
        {
            const hasNonExistingProcedure = node.hasProcedure('nonExisting');

            expect(hasNonExistingProcedure).toBeFalsy();
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should run a public procedure that calls a private procedure on the same segment', async () =>
        {
            const request = new Request('second', Version.DEFAULT, new Map(), new Map());
            const response = await node.run(request);

            expect(response.result).toBe('first');
        });

        it('should run a public procedure that calls a private procedure on another segment', async () =>
        {
            const request = new Request('sixth', Version.DEFAULT, new Map(), new Map());
            const response = await node.run(request);

            expect(response.result).toBe('first');
        });

        it('should run a public procedure that calls a public procedure on another segment', async () =>
        {
            const request = new Request('third', Version.DEFAULT, new Map(), new Map());
            const response = await node.run(request);

            expect(response.result).toBe('fourth');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map());
            const run = async () => node.run(request);

            expect(run).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });
    });
});
