
import { describe, expect, it } from 'vitest';

import { MONITORS, GATEWAY, NODES } from '../_fixtures/services/NodeMonitor.fixture';

const monitor = MONITORS.HEALTH;

describe('services/LocalGateway', () =>
{
    describe('.monitor()', () =>
    {
        it('should keep a node and remove a node', async () =>
        {
            const beforeNodes = GATEWAY.nodes;

            expect(beforeNodes.length).toBe(2);
            expect(beforeNodes[0]).toBe(NODES.GOOD);
            expect(beforeNodes[1]).toBe(NODES.BAD);

            monitor.start();
            await new Promise(resolve => setTimeout(resolve, 300));
            monitor.stop();

            const afterNodes = GATEWAY.nodes;

            expect(afterNodes.length).toBe(1);
            expect(afterNodes[0]).toBe(NODES.GOOD);
        });
    });
});
