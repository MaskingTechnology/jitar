
import { describe, expect, it } from 'vitest';

import NoNodeAvailable from '../../src/errors/NoNodeAvailable';
import Version from '../../src/models/Version';

import { BALANCERS, NODES } from '../_fixtures/services/NodeBalancer.fixture';

const balancer = BALANCERS.FILLED;
const emptyBalancer = BALANCERS.EMPTY;

describe('services/LocalGateway', () =>
{
    describe('.getNextNode()', () =>
    {
        it('should select nodes round robin', async () =>
        {
            const firstSelectedNode = balancer.getNextNode();
            const secondSelectedNode = balancer.getNextNode();
            const thirdSelectedNode = balancer.getNextNode();
            const fourthSelectedNode = balancer.getNextNode();

            expect(firstSelectedNode).toBe(NODES.FIRST);
            expect(secondSelectedNode).toBe(NODES.SECOND);
            expect(thirdSelectedNode).toBe(NODES.FIRST);
            expect(fourthSelectedNode).toBe(NODES.SECOND);
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should throw a node not available error', async () =>
        {
            const run = async () => await emptyBalancer.run('nonExisting', Version.DEFAULT, new Map(), new Map());

            expect(run).rejects.toEqual(new NoNodeAvailable('nonExisting'));
        });
    });
});
