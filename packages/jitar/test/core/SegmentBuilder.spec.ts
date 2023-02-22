
import { describe, expect, it } from 'vitest'

import { segmentModule } from '../_fixtures/core/SegmentBuilder.fixture';

import SegmentBuilder from '../../src/core/SegmentBuilder';
import Version from '../../src/core/Version';

describe('core/SegmentBuilder', () =>
{
    describe('.build(module)', () =>
    {
        const segment = SegmentBuilder.build('test', segmentModule);

        it('should have an id', () =>
        {
            expect(segment.id).toBe('test');
        });

        it('should have procedures', async () =>
        {
            const hasDefaultFunction = segment.hasProcedure('defaultFunction');
            const hasAnotherFunction = segment.hasProcedure('anotherFunction');

            expect(hasDefaultFunction).toBeTruthy();
            expect(hasAnotherFunction).toBeTruthy();
        });

        it('should have implementations', async () =>
        {
            const defaultFunction = segment.getProcedure('defaultFunction');
            const anotherFunction = segment.getProcedure('anotherFunction');

            const defaultImplementation = defaultFunction?.getImplementation(new Version(0, 0, 0));
            const anotherImplementation = anotherFunction?.getImplementation(new Version(1, 0, 0));

            expect(defaultImplementation).toBeDefined();
            expect(anotherImplementation).toBeDefined();
        });
    });
});
