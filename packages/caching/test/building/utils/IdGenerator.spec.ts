
import { describe, expect, it } from 'vitest';

import IdGenerator from '../../../src/building/utils/IdGenerator';

describe('building/utils/IdGenerator', () =>
{
    describe('.next()', () =>
    {
        it('should create incremental ids', () =>
        {
            const generator = new IdGenerator();

            const first = generator.next();
            const second = generator.next();
            const third = generator.next();

            expect(first).toBe('$1');
            expect(second).toBe('$2');
            expect(third).toBe('$3');
        });
    });
});
