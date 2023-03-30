
import { describe, expect, it } from 'vitest';

import ProcedureNotFound from '../../src/errors/ProcedureNotFound';
import Version from '../../src/models/Version';

import '../_fixtures/services/LocalNode.fixture';
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

    describe('.run(name, version, parameters)', () =>
    {
        it('should find and run a procedure from a node', async () =>
        {
            const firstResult = await gateway.run('second', Version.DEFAULT, new Map(), new Map());

            expect(firstResult).toBe('first');
        });

        it('should find and run a procedure from a node that calls a procedure on another node', async () =>
        {
            const result = await gateway.run('third', Version.DEFAULT, new Map(), new Map());

            expect(result).toBe('fourth');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const run = async () => await gateway.run('nonExisting', Version.DEFAULT, new Map(), new Map());

            expect(run).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });
    });
});
