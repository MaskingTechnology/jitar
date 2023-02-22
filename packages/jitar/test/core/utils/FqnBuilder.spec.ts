
import { describe, expect, it } from 'vitest'

import FqnBuilder from '../../../src/core/utils/FqnBuilder';

describe('core/utils/FqnBuilder', () =>
{
    describe('.build(module, name)', () =>
    {
        it('should have its name only when no module is defined', () =>
        {
            const fqn = FqnBuilder.build('', 'myRootProcedure');

            expect(fqn).toBe('myRootProcedure');
        });

        it('should have a combination of module and name when a module is defined', () =>
        {
            const fqn = FqnBuilder.build('my/module', 'myModuleProcedure');

            expect(fqn).toBe('my/module/myModuleProcedure');
        });
    });
});
