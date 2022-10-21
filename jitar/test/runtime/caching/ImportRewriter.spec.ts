
import ImportRewriter from '../../../src/runtime/caching/ImportRewriter';

import
{
    noSystemImports, noSystemImportsResult,
    hasSystemImports, hasSystemImportsResult,
    hasJitarImports, hasJitarImportsResult,
    hasMixedImports, hasMixedImportsResult,
    hasDynamicImports, hasDynamicImportsResult,
    hasImportsAndContent, hasImportsAndContentResult,
    hasImportsNoSemicolon, hasImportsResultNoSemicolon
} from '../../_fixtures/runtime/caching/ImportRewriter.fixture';

describe('runtime/utils/ImportRewriter', () =>
{
    describe('.rewrite(module)', () =>
    {
        it('should not rewrite non-system imports', () =>
        {
            const result = ImportRewriter.rewrite(noSystemImports);

            expect(result).toBe(noSystemImportsResult);
        });

        it('should rewrite all system imports', () =>
        {
            const result = ImportRewriter.rewrite(hasSystemImports);

            expect(result).toBe(hasSystemImportsResult);
        });

        it('should rewrite all jitar imports', () =>
        {
            const result = ImportRewriter.rewrite(hasJitarImports);

            expect(result).toBe(hasJitarImportsResult);
        });

        it('should rewrite all imports without semicolon', () =>
        {
            const result = ImportRewriter.rewrite(hasImportsNoSemicolon);

            expect(result).toBe(hasImportsResultNoSemicolon);
        });

        it('should rewrite mixed system and jitar imports', () =>
        {
            const result = ImportRewriter.rewrite(hasMixedImports);

            expect(result).toBe(hasMixedImportsResult);
        });

        it('should not rewrite dynamic imports', () =>
        {
            const result = ImportRewriter.rewrite(hasDynamicImports);

            expect(result).toBe(hasDynamicImportsResult);
        });

        it('should not modify any content', () =>
        {
            const result = ImportRewriter.rewrite(hasImportsAndContent);

            expect(result).toBe(hasImportsAndContentResult);
        });
    });
});
