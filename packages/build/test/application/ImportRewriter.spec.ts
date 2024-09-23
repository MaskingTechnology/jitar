
import { describe, expect, it } from 'vitest';

import { MODULES, SEGMENTATION, SEGMENTS } from '../fixtures';

import ImportRewriter from '../../src/application/ImportRewriter';

describe('application/ImportRewriter', () =>
{
    describe('.rewrite()', () =>
    {
        it('should ...', () =>
        {
            const rewriter = new ImportRewriter(MODULES.C, SEGMENTATION, SEGMENTS.FIRST);

            const code = rewriter.rewrite();

            console.log(code);

            expect(true).toBe(true);
        });
    });
});
