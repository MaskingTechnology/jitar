
import { describe, expect, it } from 'vitest';

import ModuleAnalyser from '../../../src/runtime/utils/ModuleAnalyser';

import { ReflectionClass, ReflectionField, ReflectionFunction } from 'jitar-reflection';

import { theModule } from '../../_fixtures/runtime/utils/ModuleAnaliser.fixture';

describe('runtime/utils/ModuleAnaliser', () =>
{
    describe('.filterFields(module)', () =>
    {
        it('should filter all field types', () =>
        {
            const result = ModuleAnalyser.filterFields(theModule);

            expect(result.size).toBe(1);
            expect(result.get('hello')).toBeInstanceOf(ReflectionField);
        });
    });

    describe('.filterFunctions(module)', () =>
    {
        it('should filter all actual functions', () =>
        {
            const result = ModuleAnalyser.filterFunctions(theModule);

            expect(result.size).toBe(1);
            expect(result.get('sayHello')).toBeInstanceOf(ReflectionFunction);
        });
    });

    describe('.filterClasses(module)', () =>
    {
        it('should filter all actual classes', () =>
        {
            const result = ModuleAnalyser.filterClasses(theModule);

            expect(result.size).toBe(1);
            expect(result.get('default')).toBeInstanceOf(ReflectionClass);
        });
    });
});
