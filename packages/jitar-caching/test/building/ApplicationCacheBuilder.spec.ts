
import { describe, expect, it } from 'vitest';

import ApplicationCacheBuilder from '../../src/building/ApplicationCacheBuilder';

import { INPUT, OUTPUT } from '../_fixtures/building/ApplicationCacheBuilder.fixture';

const applicationCacheBuilder = new ApplicationCacheBuilder();

describe('building/ApplicationCacheBuilder', () =>
{
    describe('.build(application)', () =>
    {
        it('should build a cache model for an application', () =>
        {
            const result = applicationCacheBuilder.build(INPUT);
            
            // Check if the segments are correctly created
            expect(result.segments).toHaveLength(OUTPUT.segments.length);
            expect(result.segments[0].name).toEqual(OUTPUT.segments[0].name);
            expect(result.segments[1].name).toEqual(OUTPUT.segments[1].name);

            // Check if the modules are correctly created
            expect(result.modules).toHaveLength(OUTPUT.modules.length);
            expect(result.modules[0].module.filename).toEqual(OUTPUT.modules[0].module.filename);
            expect(result.modules[1].module.filename).toEqual(OUTPUT.modules[1].module.filename);
            expect(result.modules[2].module.filename).toEqual(OUTPUT.modules[2].module.filename);
            expect(result.modules[3].module.filename).toEqual(OUTPUT.modules[3].module.filename);
            expect(result.modules[4].module.filename).toEqual(OUTPUT.modules[4].module.filename);
        });
    });
});
