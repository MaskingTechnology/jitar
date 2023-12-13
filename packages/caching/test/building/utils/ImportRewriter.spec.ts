
import { describe, expect, it } from 'vitest';

import ImportRewriter from '../../../src/building/utils/ImportRewriter';

import { INPUTS, OUTPUTS, SOURCE_FILE } from '../../_fixtures/building/utils/ImportRewriter.fixture';

const importRewriter = new ImportRewriter();

describe('building/utils/ImportRewriter', () =>
{
    describe('.rewrite(module)', () =>
    {
        it('should rewrite application imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.APPLICATION_IMPORTS, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.APPLICATION_IMPORTS_RESULT);
        });

        it('should rewrite runtime imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.RUNTIME_IMPORTS, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.RUNTIME_IMPORTS_RESULT);
        });

        it('should rewrite imports without closing semicolon', () =>
        {
            const result = importRewriter.rewrite(INPUTS.IMPORT_WITHOUT_SEMICOLON, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.IMPORT_WITHOUT_SEMICOLON_RESULT);
        });

        it('should rewrite application and runtime imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.MIXED_IMPORTS, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.MIXED_IMPORTS_RESULT);
        });

        it('should not rewrite dynamic imports', () =>
        {
            const result = importRewriter.rewrite(INPUTS.DYNAMIC_IMPORTS, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.DYNAMIC_IMPORTS_RESULT);
        });

        it('should not modify any content', () =>
        {
            const result = importRewriter.rewrite(INPUTS.IMPORTS_AND_CONTENT, SOURCE_FILE);

            expect(result).toBe(OUTPUTS.IMPORTS_AND_CONTENT_RESULT);
        });
    });
});
