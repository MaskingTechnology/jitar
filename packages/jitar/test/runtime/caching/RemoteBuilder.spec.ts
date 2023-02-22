
import { describe, expect, it } from 'vitest';

import RemoteBuilder from '../../../src/runtime/caching/RemoteBuilder';

import
{
    segmentModule,
    codeResult
} from '../../_fixtures/runtime/caching/RemoteBuilder.fixture';

describe('runtime/utils/RemoteBuilder', () =>
{
    describe('.build(module)', () =>
    {
        it('should create remote implementations for all exported functions', () =>
        {
            const result = RemoteBuilder.build(segmentModule);

            expect(result).toBe(codeResult);
        });
    });
});
