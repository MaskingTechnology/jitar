
import { describe, expect, it } from 'vitest';

import SegmentReader from '../../src/building/SegmentReader';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/SegmentReader.fixture';

const fileManager = new TestFileManager();
const segmentReader = new SegmentReader(fileManager);

describe('building/SegmentReader', () =>
{
    describe('.read(filename)', () =>
    {
        it('should read a segment from a definition file', async () =>
        {
            const result = await segmentReader.read(INPUT);
            expect(result.name).toEqual(OUTPUT.name);
            expect(result.modules).toHaveLength(OUTPUT.modules.length);

            const firstModuleResult = result.modules[0];
            const firstModuleOutput = OUTPUT.modules[0];
            expect(firstModuleResult.filename).toEqual(firstModuleOutput.filename);
            expect(firstModuleResult.procedures).toHaveLength(firstModuleOutput.procedures.length);

            const firstProcedureResult = firstModuleResult.procedures[0];
            const firstProcedureOutput = firstModuleOutput.procedures[0];
            expect(firstProcedureResult.fqn).toEqual(firstProcedureOutput.fqn);
            expect(firstProcedureResult.implementations).toHaveLength(firstProcedureOutput.implementations.length);

            const firstImplementationResult = firstProcedureResult.implementations[0];
            const firstImplementationOutput = firstProcedureOutput.implementations[0];
            expect(firstImplementationResult.id).toEqual(firstImplementationOutput.id);
            expect(firstImplementationResult.importKey).toEqual(firstImplementationOutput.importKey);
            expect(firstImplementationResult.access).toEqual(firstImplementationOutput.access);
            expect(firstImplementationResult.version).toEqual(firstImplementationOutput.version);

            const secondModuleResult = result.modules[0];
            const secondModuleOutput = OUTPUT.modules[0];
            expect(secondModuleResult.filename).toEqual(secondModuleOutput.filename);
            expect(secondModuleResult.procedures).toHaveLength(secondModuleOutput.procedures.length);

            const secondProcedureResult = secondModuleResult.procedures[0];
            const secondProcedureOutput = secondModuleOutput.procedures[0];
            expect(secondProcedureResult.fqn).toEqual(secondProcedureOutput.fqn);
            expect(secondProcedureResult.implementations).toHaveLength(secondProcedureOutput.implementations.length);

            const secondImplementationResult = secondProcedureResult.implementations[0];
            const secondImplementationOutput = secondProcedureOutput.implementations[0];
            expect(secondImplementationResult.id).toEqual(secondImplementationOutput.id);
            expect(secondImplementationResult.importKey).toEqual(secondImplementationOutput.importKey);
            expect(secondImplementationResult.access).toEqual(secondImplementationOutput.access);
            expect(secondImplementationResult.version).toEqual(secondImplementationOutput.version);
        });
    });
});
