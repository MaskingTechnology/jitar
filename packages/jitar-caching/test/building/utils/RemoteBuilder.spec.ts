
import { describe, expect, it } from 'vitest';

import RemoteBuilder from '../../../src/building/utils/RemoteBuilder';

import { INPUT, OUTPUT } from '../../_fixtures/building/utils/RemoteBuilder.fixture';

const remoteBuilder = new RemoteBuilder();

describe('building/utils/RemoteBuilder', () =>
{
    describe('.build(module)', () =>
    {
        it('should create remote calls for all procedure implementations', () =>
        {
            const result = remoteBuilder.build(INPUT);

            expect(result).toBe(OUTPUT);
        });
    });
});
