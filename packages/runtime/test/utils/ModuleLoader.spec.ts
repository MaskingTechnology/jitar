
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
        it('should load an existing specifier from the base URL', async () =>
        {
            const module = await ModuleLoader.load('public/app.js');

            expect(module.default).toBeInstanceOf(Function);
        });

        it('should not load non-existing specifier from the base URL', () =>
        {
            const run = () => ModuleLoader.load('public/non-existing.js');

            expect(run).rejects.toEqual(new ModuleNotLoaded('public/non-existing.js', 'Not found'));
        });

        it('should not allow URLs outside the base URL', () =>
        {
            const run = () => ModuleLoader.load('../secrets.js');

            expect(run).rejects.toEqual(new ModuleNotAccessible('../secrets.js'));
        });
    });

    describe('.import(specifier)', () =>
    {
        it('should import an existing specifier', async () =>
        {
            const module = await ModuleLoader.import('/root/app/public/app.js');

            expect(module.default).toBeInstanceOf(Function);
        });

        it('should not import a non-existing specifier', () =>
        {
            const run = () => ModuleLoader.load('/root/app/public/non-existing.js');

            expect(run).rejects.toEqual(new ModuleNotLoaded('/root/app/public/non-existing.js', 'Not found'));
        });
    });
});
