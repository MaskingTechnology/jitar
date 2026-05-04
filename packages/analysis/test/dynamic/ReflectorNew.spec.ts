
import { describe, expect, it } from 'vitest';

import { ESParameter } from '../../src/model';
import { ReflectorNew as Reflector } from '../../src/dynamic';

import { CLASSES, FUNCTIONS, OBJECTS, MODULES } from './fixtures';

const reflector = new Reflector();

describe('Reflector', () =>
{
    describe('.fromModule(module, inherit)', () =>
    {
        it('should get all members from a module', () =>
        {
            const reflectionModule = reflector.fromModule(MODULES.MIXED, false);
            
            const statements = reflectionModule.statements;
            expect(statements).toHaveLength(3);

            const variables = reflectionModule.variables;
            expect(variables).toHaveLength(1);
            expect(variables[0].identifier).toEqual('johnDoe');
            
            const functions = reflectionModule.functions;
            expect(functions).toHaveLength(1);
            expect(functions[0].identifier).toEqual('requiredFunction');

            const classes = reflectionModule.classes;
            expect(classes).toHaveLength(1);
            expect(classes[0].identifier).toEqual('Child');
        });
    });

    describe('.fromClass(clazz, inherit)', () =>
    {
        it('should get class reflection model without parent members from a class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.Child, false);
            expect(reflectionClass.identifier).toEqual('Child');
            expect(reflectionClass.members).toHaveLength(9);
            expect(reflectionClass.construct).toBeDefined();

            const fields = reflectionClass.fields;
            expect(fields).toHaveLength(4);
            expect(fields[0].identifier).toEqual('firstName');
            expect(fields[1].identifier).toEqual('lastName');
            expect(fields[2].identifier).toEqual('age');
            expect(fields[3].identifier).toEqual('state');

            const getters = reflectionClass.getters;
            expect(getters).toHaveLength(2);
            expect(getters[0].identifier).toEqual('fullName');
            expect(getters[1].identifier).toEqual('age');

            const setters = reflectionClass.setters;
            expect(setters).toHaveLength(1);
            expect(setters[0].identifier).toEqual('state');

            const methods = reflectionClass.methods;
            expect(methods).toHaveLength(1);
            expect(methods[0].identifier).toEqual('toString');
        });

        it('should get class reflection model with parent members from a class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.Child, true);
            expect(reflectionClass.identifier).toEqual('Child');
            expect(reflectionClass.members).toHaveLength(11);
            expect(reflectionClass.construct).toBeDefined();

            const fields = reflectionClass.fields;
            expect(fields).toHaveLength(5);
            expect(fields[0].identifier).toEqual('id');
            expect(fields[1].identifier).toEqual('firstName');
            expect(fields[2].identifier).toEqual('lastName');
            expect(fields[3].identifier).toEqual('age');
            expect(fields[4].identifier).toEqual('state');

            const getters = reflectionClass.getters;
            expect(getters).toHaveLength(2);
            expect(getters[0].identifier).toEqual('fullName');
            expect(getters[1].identifier).toEqual('age');

            const setters = reflectionClass.setters;
            expect(setters).toHaveLength(1);
            expect(setters[0].identifier).toEqual('state');

            const methods = reflectionClass.methods;
            expect(methods).toHaveLength(2);
            expect(methods[0].identifier).toEqual('speak');
            expect(methods[1].identifier).toEqual('toString');
        });

        it('should get class reflection model from a function based class', () =>
        {
            const reflectionClass = reflector.fromClass(Error, true);
            expect(reflectionClass.identifier).toEqual('Error');
            expect(reflectionClass.members).toHaveLength(3);
            expect(reflectionClass.construct).toBeUndefined();

            const fields = reflectionClass.fields;
            expect(fields).toHaveLength(1);
            expect(fields[0].identifier).toEqual('stack');

            const methods = reflectionClass.methods;
            expect(methods).toHaveLength(2);
            expect(methods[0].identifier).toEqual('Error');
            expect(methods[1].identifier).toEqual('toString');
        });

        it('should get class reflection model from a class with function based parent class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.CustomError, true);
            expect(reflectionClass.identifier).toEqual('CustomError');
            expect(reflectionClass.members).toHaveLength(6);
            expect(reflectionClass.construct).toBeDefined();

            const fields = reflectionClass.fields;
            expect(fields).toHaveLength(2);
            expect(fields[0].identifier).toEqual('stack');
            expect(fields[1].identifier).toEqual('additional');

            const getters = reflectionClass.getters;
            expect(getters).toHaveLength(1);
            expect(getters[0].identifier).toEqual('additional');

            const methods = reflectionClass.methods;
            expect(methods).toHaveLength(2);
            expect(methods[0].identifier).toEqual('Error');
            expect(methods[1].identifier).toEqual('toString');
        });
    });

    describe('.fromObject(object)', () =>
    {
        it('should get class reflection model without parent members from an object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CLASS, false);
            expect(reflectionClass.identifier).toEqual('Child');
            expect(reflectionClass.members).toHaveLength(9);
        });

        it('should get class reflection model with parent members from an object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CLASS, true);
            expect(reflectionClass.identifier).toEqual('Child');
            expect(reflectionClass.members).toHaveLength(11);
        });

        it('should get class reflection model from a function based class object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.ERROR, true);
            expect(reflectionClass.identifier).toEqual('Error');
            expect(reflectionClass.members).toHaveLength(3);
        });

        it('should get class reflection model from a a class object with function based parent class', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CUSTOM_ERROR, true);
            expect(reflectionClass.identifier).toEqual('CustomError');
            expect(reflectionClass.members).toHaveLength(6);
        });
    });

    describe('.fromFunction(funktion)', () =>
    {
        it('should get function reflection model', () =>
        {
            const functionFunction = reflector.fromFunction(FUNCTIONS.OPTIONAL_ARGS);
            expect(functionFunction.identifier).toEqual('optionalFunction');
            expect(functionFunction.body.toString()).toEqual('{ return a + b + c ; }');

            const parameters = functionFunction.parameters;
            expect(parameters).toHaveLength(3);

            expect(parameters[0].binding.toString()).toEqual('a');
            expect(parameters[0].initializer).toBeUndefined();

            expect(parameters[1].binding.toString()).toEqual('b');
            expect(parameters[1].initializer?.toString(false)).toEqual('new Child ( 1 , "Jane" , "Doe" , 42 )');

            expect(parameters[2].binding.toString()).toEqual('c');
            expect(parameters[2].initializer?.toString(false)).toEqual('0');
        });
    });

    describe('.createInstance(clazz, args)', () =>
    {
        it('should get an instance class of a class', () =>
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const peter = reflector.createInstance(CLASSES.Child, [1, 'Peter', 'van Vliet', 24]) as any;
            expect(peter).toBeInstanceOf(CLASSES.Child);
            expect(peter.id).toEqual(1);
            expect(peter.fullName).toEqual('Peter van Vliet');
            expect(peter.age).toEqual(24);
        });
    });

    describe('.isClassObject(object)', () =>
    {
        it('should detect a class object', () =>
        {
            const result = reflector.isClassObject(OBJECTS.CLASS);
            expect(result).toBeTruthy();
        });

        it('should detect a non class object', () =>
        {
            const result = reflector.isClassObject(OBJECTS.PLAIN);
            expect(result).toBeFalsy();
        });
    });

    describe('.getClass(object)', () =>
    {
        it('should get the class of an object', () =>
        {
            const result = reflector.getClass(OBJECTS.CLASS);
            expect(result.name).toEqual('Child');
        });
    });

    describe('.getParentClass(object)', () =>
    {
        it('should get the parent of a class', () =>
        {
            const result = reflector.getParentClass(CLASSES.Child);
            expect(result.name).toEqual('Parent');
        });
    });
});
