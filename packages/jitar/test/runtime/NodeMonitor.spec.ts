
import
{
    goodNode,
    badNode,
    gateway,
    monitor
} from '../_fixtures/runtime/NodeMonitor.fixture';

import { describe, expect, it } from 'vitest';

describe('runtime/LocalGateway', () =>
{
    describe('.monitor()', () =>
    {
        it('should keep a node and remove a node', async () =>
        {
            const beforeNodes = gateway.nodes;

            expect(beforeNodes.length).toBe(2);
            expect(beforeNodes[0]).toBe(goodNode);
            expect(beforeNodes[1]).toBe(badNode);

            monitor.start();
            await new Promise(resolve => setTimeout(resolve, 300));
            monitor.stop();

            const afterNodes = gateway.nodes;

            expect(afterNodes.length).toBe(1);
            expect(afterNodes[0]).toBe(goodNode);
        });
    });
});
