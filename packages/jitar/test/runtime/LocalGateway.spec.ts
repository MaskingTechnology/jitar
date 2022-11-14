
import ProcedureNotFound from '../../src/core/errors/ProcedureNotFound';
import Version from '../../src/core/Version';

import { API_URL, gateway } from '../_fixtures/runtime/LocalGateway.fixture';

describe('runtime/LocalGateway', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(gateway.url).toContain(API_URL);
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should find and run a procedure from a node', async () =>
        {
            const firstResult = await gateway.run('my/module/firstPublicTask', Version.DEFAULT, new Map());

            expect(firstResult).toBe('first');
        });

        it('should find and run a procedure from a node that calls a procedure on another node', async () =>
        {
            const result = await gateway.run('my/module/thirdPublicTask', Version.DEFAULT, new Map());

            expect(result).toBe('fourth');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const run = async() => await gateway.run('my/module/nonExistingTask', Version.DEFAULT, new Map());

            expect(run).rejects.toEqual(new ProcedureNotFound('my/module/nonExistingTask'));
        });
    });
});
