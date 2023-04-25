
import { describe, expect, it } from 'vitest';

import ModuleCacheBuilder from '../../src/building/ModuleCacheBuilder';

import { INPUT, OUTPUT } from '../_fixtures/building/ModuleCacheBuilder.fixture';

const moduleCacheBuilder = new ModuleCacheBuilder();

describe('building/ModuleCacheBuilder', () =>
{
    describe('.build(application, module)', () =>
    {
        it('should build a cache model for a module', () =>
        {
            const result = moduleCacheBuilder.build(INPUT.APPLICATION, INPUT.MODULE);

            // Check if the correct module and segment are set
            expect(result.module.filename).toEqual(OUTPUT.module.filename);
            expect(result.segment?.filename).toEqual(OUTPUT.segment?.filename);
        });
    });
});
