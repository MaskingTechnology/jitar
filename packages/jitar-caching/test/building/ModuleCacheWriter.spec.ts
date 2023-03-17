
import { describe, expect, it } from 'vitest';

import ModuleCacheWriter from '../../src/building/ModuleCacheWriter';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { CACHE_MODULE_FILENAMES } from '../_fixtures/CacheFiles.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/ModuleCacheWriter.fixture';

describe('building/ModuleCacheWriter', () =>
{
    describe('.write(cache)', () =>
    {
        it('should write module cache files', async () =>
        {
            // We need to create a new file manager for each test, because the file manager
            // keeps track of the files that are written to disk.

            const fileManager = new TestFileManager();
            const moduleCacheWriter = new ModuleCacheWriter(fileManager);

            await moduleCacheWriter.write(INPUT.CREATE_ORDER);
            await moduleCacheWriter.write(INPUT.STORE_ORDER);
            await moduleCacheWriter.write(INPUT.ORDER_MODELS);
            await moduleCacheWriter.write(INPUT.GET_PRODUCTS);
            await moduleCacheWriter.write(INPUT.GET_PRODUCTS_V1);
            await moduleCacheWriter.write(INPUT.PRODUCT_MODELS);

            const result = fileManager.writtenFiles;
            expect(result.size).toBe(CACHE_MODULE_FILENAMES.length);
            
            expect(result.get(OUTPUT.FILENAMES.CREATE_ORDER_LOCAL)).toBe(OUTPUT.CONTENT.CREATE_ORDER_LOCAL);
            expect(result.get(OUTPUT.FILENAMES.CREATE_ORDER_REMOTE)).toBe(OUTPUT.CONTENT.CREATE_ORDER_REMOTE);

            expect(result.get(OUTPUT.FILENAMES.STORE_ORDER_LOCAL)).toBe(OUTPUT.CONTENT.STORE_ORDER_LOCAL);
            expect(result.get(OUTPUT.FILENAMES.STORE_ORDER_REMOTE)).toBe(OUTPUT.CONTENT.STORE_ORDER_REMOTE);

            expect(result.get(OUTPUT.FILENAMES.ORDER_MODELS_LOCAL)).toBe(OUTPUT.CONTENT.ORDER_MODELS_LOCAL);

            expect(result.get(OUTPUT.FILENAMES.GET_PRODUCTS_LOCAL)).toBe(OUTPUT.CONTENT.GET_PRODUCTS_LOCAL);
            expect(result.get(OUTPUT.FILENAMES.GET_PRODUCTS_REMOTE)).toBe(OUTPUT.CONTENT.GET_PRODUCTS_REMOTE);

            expect(result.get(OUTPUT.FILENAMES.GET_PRODUCTS_LOCAL_V1)).toBe(OUTPUT.CONTENT.GET_PRODUCTS_LOCAL_V1);
            expect(result.get(OUTPUT.FILENAMES.GET_PRODUCTS_REMOTE_V1)).toBe(OUTPUT.CONTENT.GET_PRODUCTS_REMOTE_V1);

            expect(result.get(OUTPUT.FILENAMES.PRODUCT_MODELS_LOCAL)).toBe(OUTPUT.CONTENT.PRODUCT_MODELS_LOCAL);
        });
    });
});
