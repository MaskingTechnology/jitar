
import { describe, expect, it } from 'vitest';

import ImportRewriter from '../../../src/building/utils/ImportRewriter';

import { INPUTS, OUTPUTS } from '../../_fixtures/building/utils/ImportRewriter.fixture';

const importRewriter = new ImportRewriter();

describe('building/utils/ImportRewriter', () =>
{
    describe('.rewrite(module)', () =>
    {
        it('should not rewrite non-system imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.NO_SYSTEM_IMPORTS);

            expect(result).toBe(OUTPUTS.NO_SYSTEM_IMPORTS_RESULT);
        });

        it('should rewrite all system imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.HAS_SYSTEM_IMPORTS);

            expect(result).toBe(OUTPUTS.HAS_SYSTEM_IMPORTS_RESULT);
        });

        it('should rewrite all imports without semicolon', () =>
        {
            const result = importRewriter.rewrite(INPUTS.HAS_IMPORT_NO_SEMICOLON);

            expect(result).toBe(OUTPUTS.HAS_IMPORT_NO_SEMICOLON_RESULT);
        });

        it('should rewrite mixed system and jitar imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.HAS_MIXED_IMPORTS);

            expect(result).toBe(OUTPUTS.HAS_MIXED_IMPORTS_RESULT);
        });

        it('should not rewrite dynamic imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.HAS_DYNAMIC_IMPORTS);

            expect(result).toBe(OUTPUTS.HAS_DYNAMIC_IMPORTS_RESULT);
        });

        it('should not modify any content', () =>
        {
            const result = importRewriter.rewrite(INPUTS.HAS_IMPORTS_AND_CONTENT);

            expect(result).toBe(OUTPUTS.HAS_IMPORTS_AND_CONTENT_RESULT);
        });
    });
});
