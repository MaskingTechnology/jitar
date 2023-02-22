
import { describe, expect, it } from 'vitest';

import SourceAppender from '../../../src/runtime/caching/SourceAppender';

import
{
    applicationModule,
    emptyModule,
    filecode,
    filename,
    codeResult
} from '../../_fixtures/runtime/caching/SourceAppender.fixture';

describe('runtime/utils/SourceAppender', () =>
{
    describe('.append(module, code, filename)', () =>
    {
        it('should append a source properties to all exported classes', () =>
        {
            const result = SourceAppender.append(applicationModule, filecode, filename);

            expect(result).toBe(codeResult);
        });

        it('should not append any source', () =>
        {
            const result = SourceAppender.append(emptyModule, filecode, filename);

            expect(result).toBe(filecode);
        });
    });
});
