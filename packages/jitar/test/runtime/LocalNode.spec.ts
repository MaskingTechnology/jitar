
import ProcedureNotFound from '../../src/core/errors/ProcedureNotFound';
import Version from '../../src/core/Version';

import { API_URL, node } from '../_fixtures/runtime/LocalNode.fixture';

describe('runtime/LocalNode', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(node.url).toContain(API_URL);
        });
    });

    describe('.isHealty()', () =>
    {
        it('should be healthy', () =>
        {
            const healthy = node.isHealthy();

            expect(healthy).toBeTruthy();
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should find public procedures', () =>
        {
            const hasFirstProcedure = node.hasProcedure('my/module/firstPublicTask');
            const hasSecondProcedure = node.hasProcedure('my/module/secondPublicTask');
            const hasThirdProcedure = node.hasProcedure('my/module/thirdPublicTask');

            expect(hasFirstProcedure).toBeTruthy();
            expect(hasSecondProcedure).toBeTruthy();
            expect(hasThirdProcedure).toBeTruthy();
        });

        it('should not find private procedures', () =>
        {
            const hasFirstProcedure = node.hasProcedure('my/module/firstPrivateTask');
            const hasSecondProcedure = node.hasProcedure('my/module/secondPrivateTask');

            expect(hasFirstProcedure).toBeFalsy();
            expect(hasSecondProcedure).toBeFalsy();
        });

        it('should not find non-existing procedures', () =>
        {
            const hasNoProcedure = node.hasProcedure('my/module/nonExistingTask');

            expect(hasNoProcedure).toBeFalsy();
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should run a public procedure that calls a private procedure on the same segment', async () =>
        {
            const result = await node.run('my/module/firstPublicTask', Version.DEFAULT, new Map());

            expect(result).toBe('first');
        });

        it('should run a public procedure that calls a private procedure on another segment', async () =>
        {
            const result = await node.run('my/module/secondPublicTask', Version.DEFAULT, new Map());

            expect(result).toBe('first');
        });

        it('should run a public procedure that calls a public procedure on another segment', async () =>
        {
            const result = await node.run('my/module/thirdPublicTask', Version.DEFAULT, new Map());

            expect(result).toBe('fourth');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const run = async() => await node.run('my/module/nonExistingTask', Version.DEFAULT, new Map());

            expect(run).rejects.toEqual(new ProcedureNotFound('my/module/nonExistingTask'));
        });
    });
});
