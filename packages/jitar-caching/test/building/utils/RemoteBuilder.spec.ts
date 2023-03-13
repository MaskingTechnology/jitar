
import { describe, expect, it } from 'vitest';

import RemoteBuilder from '../../../src/building/utils/RemoteBuilder';

import
{
    segmentModule,
    codeResult
} from '../../_fixtures/building/utils/RemoteBuilder.fixture';

const remoteBuilder = new RemoteBuilder();

describe('building/utils/RemoteBuilder', () =>
{
    describe('.build(module)', () =>
    {
        it('should create remote calls for all procedure implementations', () =>
        {
            const result = remoteBuilder.build(segmentModule);

            expect(result).toBe(codeResult);
        });
    });
});
