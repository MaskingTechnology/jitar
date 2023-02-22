
import { describe, expect, it } from 'vitest'

import NoNodeAvailable from '../../src/runtime/errors/NoNodeAvailable';
import Version from '../../src/core/Version';

import
    {
        balancer,
        emptyBalancer,
        firstNode,
        secondNode
    } from '../_fixtures/runtime/NodeBalancer.fixture';

describe('runtime/LocalGateway', () =>
{
    describe('.getNextNode()', () =>
    {
        it('should select nodes round robin', async () =>
        {
            const firstSelectedNode = balancer.getNextNode();
            const secondSelectedNode = balancer.getNextNode();
            const thirdSelectedNode = balancer.getNextNode();
            const fouthSelectedNode = balancer.getNextNode();

            expect(firstSelectedNode).toBe(firstNode);
            expect(secondSelectedNode).toBe(secondNode);
            expect(thirdSelectedNode).toBe(firstNode);
            expect(fouthSelectedNode).toBe(secondNode);
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('throw a node not available error', async () =>
        {
            const run = async () => await emptyBalancer.run('NoProcedure', Version.DEFAULT, new Map(), new Map());

            expect(run).rejects.toEqual(new NoNodeAvailable('NoProcedure'));
        });
    });
});
