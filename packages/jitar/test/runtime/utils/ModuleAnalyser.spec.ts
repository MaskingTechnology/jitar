
import ModuleAnalyser from '../../../src/runtime/utils/ModuleAnalyser';

import {
    theModule,
    pojo,
    realFunction,
    realClass
} from '../../_fixtures/runtime/utils/ModuleAnaliser.fixture';

describe('runtime/utils/ModuleAnaliser', () =>
{
    describe('.filterObjects(module)', () =>
    {
        it('should filter all object types', () =>
        {
            const result = ModuleAnalyser.filterObjects(theModule);

            expect(result.size).toBe(3);
            expect(result.get('string')).toBe(undefined);
            expect(result.get('pojo')).toBe(pojo);
            expect(result.get('realFunction')).toBe(realFunction);
            expect(result.get('realClass')).toBe(realClass);
        });
    });

    describe('.filterFunctions(module)', () =>
    {
        it('should filter all actual functions', () =>
        {
            const result = ModuleAnalyser.filterFunctions(theModule);

            expect(result.size).toBe(1);
            expect(result.get('string')).toBe(undefined);
            expect(result.get('pojo')).toBe(undefined);
            expect(result.get('realFunction')).toBe(realFunction);
            expect(result.get('realClass')).toBe(undefined);
        });
    });

    describe('.filterClasses(module)', () =>
    {
        it('should filter all actual classes', () =>
        {
            const result = ModuleAnalyser.filterClasses(theModule);

            expect(result.size).toBe(1);
            expect(result.get('string')).toBe(undefined);
            expect(result.get('pojo')).toBe(undefined);
            expect(result.get('realFunction')).toBe(undefined);
            expect(result.get('realClass')).toBe(realClass);
        });
    });
});
