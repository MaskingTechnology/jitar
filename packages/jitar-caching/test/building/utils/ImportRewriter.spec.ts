
import { describe, expect, it } from 'vitest';

import ImportRewriter from '../../../src/building/utils/ImportRewriter';

import
{
    noSystemImports, noSystemImportsResult,
    hasSystemImports, hasSystemImportsResult,
    hasJitarImports, hasJitarImportsResult,
    hasMixedImports, hasMixedImportsResult,
    hasDynamicImports, hasDynamicImportsResult,
    hasImportsAndContent, hasImportsAndContentResult,
    hasImportsNoSemicolon, hasImportsResultNoSemicolon
} from '../../_fixtures/building/utils/ImportRewriter.fixture';

const importRewriter = new ImportRewriter();

describe('runtime/utils/ImportRewriter', () =>
{
    describe('.rewrite(module)', () =>
    {
        it('should not rewrite non-system imports', () =>
        {
            const result = importRewriter.rewrite(noSystemImports);

            expect(result).toBe(noSystemImportsResult);
        });

        it('should rewrite all system imports', () =>
        {
            const result = importRewriter.rewrite(hasSystemImports);

            expect(result).toBe(hasSystemImportsResult);
        });

        it('should rewrite all jitar imports', () =>
        {
            const result = importRewriter.rewrite(hasJitarImports);

            expect(result).toBe(hasJitarImportsResult);
        });

        it('should rewrite all imports without semicolon', () =>
        {
            const result = importRewriter.rewrite(hasImportsNoSemicolon);

            expect(result).toBe(hasImportsResultNoSemicolon);
        });

        it('should rewrite mixed system and jitar imports', () =>
        {
            const result = importRewriter.rewrite(hasMixedImports);

            expect(result).toBe(hasMixedImportsResult);
        });

        it('should not rewrite dynamic imports', () =>
        {
            const result = importRewriter.rewrite(hasDynamicImports);

            expect(result).toBe(hasDynamicImportsResult);
        });

        it('should not modify any content', () =>
        {
            const result = importRewriter.rewrite(hasImportsAndContent);

            expect(result).toBe(hasImportsAndContentResult);
        });
    });
});
