
import { describe, expect, it } from 'vitest';

import SegmentCacheBuilder from '../../src/building/SegmentCacheBuilder';

import { INPUT, OUTPUT } from '../_fixtures/building/SegmentCacheBuilder.fixture';

const segmentCacheBuilder = new SegmentCacheBuilder();

describe('building/SegmentCacheBuilder', () =>
{
    describe('.build(segment)', () =>
    {
        it('should build a cache model for a segment', () =>
        {
            const result = segmentCacheBuilder.build(INPUT);
            expect(result.name).toEqual(OUTPUT.name);

            // Check if the files are correctly populated
            expect(result.files).toEqual(OUTPUT.files);
            
            // Check if the imports are correctly created
            expect(result.imports).toHaveLength(OUTPUT.imports.length);
            expect(result.imports[0].members).toEqual(OUTPUT.imports[0].members);
            expect(result.imports[0].from).toEqual(OUTPUT.imports[0].from);
            expect(result.imports[1].members).toEqual(OUTPUT.imports[1].members);
            expect(result.imports[1].from).toEqual(OUTPUT.imports[1].from);

            // Check if the procedures are merged
            expect(result.procedures).toHaveLength(OUTPUT.procedures.length);
            expect(result.procedures[0].fqn).toEqual(OUTPUT.procedures[0].fqn);
            expect(result.procedures[1].fqn).toEqual(OUTPUT.procedures[1].fqn);
        });
    });
});
