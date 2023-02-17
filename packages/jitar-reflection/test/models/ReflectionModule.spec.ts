
import ReflectionClass from '../../src/models/ReflectionClass';
import ReflectionField from '../../src/models/ReflectionField';
import ReflectionFunction from '../../src/models/ReflectionFunction';

import { reflectionModule } from '../_fixtures/models/ReflectionModule.fixture';

describe('models/ReflectionModule', () =>
{
    describe('.fields', () =>
    {
        it('should filter field members', () =>
        {
            const fields = reflectionModule.fields;
            expect(fields.length).toBe(2);

            expect(fields[0]).toBeInstanceOf(ReflectionField);
            expect(fields[0].name).toBe('peter');

            expect(fields[1]).toBeInstanceOf(ReflectionField);
            expect(fields[1].name).toBe('bas');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = reflectionModule.functions;
            expect(functions.length).toBe(2);

            expect(functions[0]).toBeInstanceOf(ReflectionFunction);
            expect(functions[0].name).toBe('createJohn');

            expect(functions[1]).toBeInstanceOf(ReflectionFunction);
            expect(functions[1].name).toBe('sum');
        });
    });

    describe('.classes', () =>
    {
        it('should filter class members', () =>
        {
            const classes = reflectionModule.classes;
            expect(classes.length).toBe(1);

            expect(classes[0]).toBeInstanceOf(ReflectionClass);
            expect(classes[0].name).toBe('Customer');
        });
    });

    describe('.exported', () =>
    {
        it('should return a map with exported members only', () =>
        {
            const exported = reflectionModule.exported;
            expect(exported.size).toBe(2);

            expect(exported.get('peter')).toBeInstanceOf(ReflectionField);
            expect(exported.get('peter')!.name).toBe('peter');

            expect(exported.get('default')).toBeInstanceOf(ReflectionFunction);
            expect(exported.get('default')!.name).toBe('sum');
        });
    });
});
