
import { describe, expect, it } from 'vitest';

import ModuleReader from '../../src/building/ModuleReader';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/ModuleReader.fixture';

const fileManager = new TestFileManager();
const moduleReader = new ModuleReader(fileManager);

describe('building/ModuleReader', () =>
{
    describe('.read(filename)', () =>
    {
        it('should read a module from a JavaScript file', async () =>
        {
            const result = await moduleReader.read(INPUT);

            expect(result).toEqual(OUTPUT);
        });
    });
});
