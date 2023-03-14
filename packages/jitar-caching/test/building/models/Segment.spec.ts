
import { describe, expect, it } from 'vitest';

import { SEGMENTS } from '../../_fixtures/building/models/Segment.fixture';

const segment = SEGMENTS.ORDER;

describe('building/models/Segment', () =>
{
    describe('.hasModule(filename)', () =>
    {
        it('should have an existing module', () =>
        {
            const result = segment.hasModule('./order/createOrder.js');

            expect(result).toBeTruthy();
        });

        it('should not have an non-existing module', () =>
        {
            const result = segment.hasModule('./non-existing.js');

            expect(result).toBeFalsy();
        });
    });

    describe('.getModule(filename)', () =>
    {
        it('should get an existing module', () =>
        {
            const result = segment.getModule('./order/createOrder.js');

            expect(result).toBeDefined();
        });

        it('should not get an non-existing module', () =>
        {
            const result = segment.getModule('./non-existing.js');

            expect(result).toBeUndefined();
        });
    });
});
