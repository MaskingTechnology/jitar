
import { describe, expect, it } from 'vitest';

import ModuleNotAccessible from '../../src/errors/ModuleNotAccessible';
import ModuleNotLoaded from '../../src/errors/ModuleNotLoaded';
import ModuleLoader from '../../src/utils/ModuleLoader';

import { moduleImporter } from '../_fixtures/utils/ModuleLoader.fixture';

ModuleLoader.setImporter(moduleImporter);
ModuleLoader.setBaseUrl('/root/app/');

describe('utils/ModuleLoader', () =>
{
    describe('.load(specifier)', () =>
    {
        it('should load an existing specifier with extension from the base URL', async () =>
        {
            const module = await ModuleLoader.load('./public/app.js');

            expect(module.default).toBeInstanceOf(Function);
        });

        it('should load an existing specifier without extension from the base URL', async () =>
        {
            const module = await ModuleLoader.load('./public/app');

            expect(module.default).toBeInstanceOf(Function);
        });

        it('should load a system import specifier', async () =>
        {
            const module = await ModuleLoader.load('jitar');

            expect(module.default).toBeInstanceOf(Function);
        });

        it('should not load non-existing specifier from the base URL', () =>
        {
            const run = () => ModuleLoader.load('./public/non-existing.js');

            expect(run).rejects.toEqual(new ModuleNotLoaded('./public/non-existing.js', 'Not found'));
        });

        it('should not allow URLs outside the base URL', () =>
        {
            const run = () => ModuleLoader.load('../secrets.js');

            expect(run).rejects.toEqual(new ModuleNotAccessible('../secrets.js'));
        });
    });
});
