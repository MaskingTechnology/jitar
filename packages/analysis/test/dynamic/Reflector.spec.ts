
import { describe, expect, it } from 'vitest';

import { ESExpression, ESField } from '../../src/models';
import { Reflector } from '../../src/dynamic';

import { CLASSES, FUNCTIONS, OBJECTS, MODULES } from './fixtures';

const reflector = new Reflector();

describe('Reflector', () =>
{
    describe('.fromModule(module, inherit)', () =>
    {
        it('should get all members from a module', () =>
        {
            const reflectionModule = reflector.fromModule(MODULES.MIXED, false);
            
            const members = reflectionModule.members;
            expect(members.length).toBe(3);

            const declarations = reflectionModule.declarations;
            expect(declarations.length).toBe(1);
            expect(declarations[0].name).toBe('johnDoe');
            
            const functions = reflectionModule.functions;
            expect(functions.length).toBe(1);
            expect(functions[0].name).toBe('requiredFunction');

            const classes = reflectionModule.classes;
            expect(classes.length).toBe(1);
            expect(classes[0].name).toBe('Child');
        });
    });

    describe('.fromClass(clazz, inherit)', () =>
    {
        it('should get class reflection model without parent members from a class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.Child, false);
            expect(reflectionClass.name).toBe('Child');

            const members = reflectionClass.members;
            expect(members.length).toBe(9);

            const declarations = reflectionClass.declarations;
            expect(declarations.length).toBe(4);
            expect(declarations[0].name).toBe('firstName');
            expect(declarations[1].name).toBe('lastName');
            expect(declarations[2].name).toBe('age');
            expect(declarations[3].name).toBe('state');

            const getters = reflectionClass.getters;
            expect(getters.length).toBe(2);
            expect(getters[0].name).toBe('fullName');
            expect(getters[1].name).toBe('age');

            const setters = reflectionClass.setters;
            expect(setters.length).toBe(1);
            expect(setters[0].name).toBe('state');

            const functions = reflectionClass.functions;
            expect(functions.length).toBe(2);
            expect(functions[0].name).toBe('constructor');
            expect(functions[1].name).toBe('toString');
        });

        it('should get class reflection model with parent members from a class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.Child, true);
            expect(reflectionClass.name).toBe('Child');

            const members = reflectionClass.members;
            expect(members.length).toBe(11);

            const declarations = reflectionClass.declarations;
            expect(declarations.length).toBe(5);
            expect(declarations[0].name).toBe('id');
            expect(declarations[1].name).toBe('firstName');
            expect(declarations[2].name).toBe('lastName');
            expect(declarations[3].name).toBe('age');
            expect(declarations[4].name).toBe('state');

            const getters = reflectionClass.getters;
            expect(getters.length).toBe(2);
            expect(getters[0].name).toBe('fullName');
            expect(getters[1].name).toBe('age');

            const setters = reflectionClass.setters;
            expect(setters.length).toBe(1);
            expect(setters[0].name).toBe('state');

            const functions = reflectionClass.functions;
            expect(functions.length).toBe(3);
            expect(functions[0].name).toBe('constructor');
            expect(functions[1].name).toBe('speak');
            expect(functions[2].name).toBe('toString');
        });

        it('should get class reflection model from a function based class', () =>
        {
            const reflectionClass = reflector.fromClass(Error, true);
            expect(reflectionClass.name).toBe('Error');

            const members = reflectionClass.members;
            expect(members.length).toBe(3);

            const declarations = reflectionClass.declarations;
            expect(declarations.length).toBe(1);
            expect(declarations[0].name).toBe('stack');

            const functions = reflectionClass.functions;
            expect(functions.length).toBe(2);
            expect(functions[0].name).toBe('Error');
            expect(functions[1].name).toBe('toString');
        });

        it('should get class reflection model from a class with function based parent class', () =>
        {
            const reflectionClass = reflector.fromClass(CLASSES.CustomError, true);
            expect(reflectionClass.name).toBe('CustomError');

            const members = reflectionClass.members;
            expect(members.length).toBe(6);

            const declarations = reflectionClass.declarations;
            expect(declarations.length).toBe(2);
            expect(declarations[0].name).toBe('stack');
            expect(declarations[1].name).toBe('additional');

            const getters = reflectionClass.getters;
            expect(getters.length).toBe(1);
            expect(getters[0].name).toBe('additional');

            const functions = reflectionClass.functions;
            expect(functions.length).toBe(3);
            expect(functions[0].name).toBe('Error');
            expect(functions[1].name).toBe('toString');
            expect(functions[2].name).toBe('constructor');
        });
    });

    describe('.fromObject(object)', () =>
    {
        it('should get class reflection model without parent members from an object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CLASS, false);
            expect(reflectionClass.name).toBe('Child');

            const members = reflectionClass.members;
            expect(members.length).toBe(9);
        });

        it('should get class reflection model with parent members from an object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CLASS, true);
            expect(reflectionClass.name).toBe('Child');

            const members = reflectionClass.members;
            expect(members.length).toBe(11);
        });

        it('should get class reflection model from a function based class object', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.ERROR, true);
            expect(reflectionClass.name).toBe('Error');

            const members = reflectionClass.members;
            expect(members.length).toBe(3);
        });

        it('should get class reflection model from a a class object with function based parent class', () =>
        {
            const reflectionClass = reflector.fromObject(OBJECTS.CUSTOM_ERROR, true);
            expect(reflectionClass.name).toBe('CustomError');

            const members = reflectionClass.members;
            expect(members.length).toBe(6);
        });
    });

    describe('.fromFunction(funktion)', () =>
    {
        it('should get function reflection model', () =>
        {
            const functionFunction = reflector.fromFunction(FUNCTIONS.OPTIONAL_ARGS);
            expect(functionFunction.name).toBe('optionalFunction');
            expect(functionFunction.body).toBe('{ return a + b + c ; }');

            const parameters = functionFunction.parameters;
            expect(parameters.length).toBe(3);

            const first = parameters[0] as ESField;
            expect(first.name).toBe('a');
            expect(first.value).toBe(undefined);

            const second = parameters[1] as ESField;
            expect(second.name).toBe('b');
            expect(second.value).toBeInstanceOf(ESExpression);
            expect(second.value?.definition).toBe('new Child ( 1 , "Jane" , "Doe" , 42 )');

            const third = parameters[2] as ESField;
            expect(third.name).toBe('c');
            expect(third.value).toBeInstanceOf(ESExpression);
            expect(third.value?.definition).toBe('0');
        });
    });

    describe('.createInstance(clazz, args)', () =>
    {
        it('should get an instance class of a class', () =>
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const peter = reflector.createInstance(CLASSES.Child, [1, 'Peter', 'van Vliet', 24]) as any;
            expect(peter).toBeInstanceOf(CLASSES.Child);
            expect(peter.id).toBe(1);
            expect(peter.fullName).toBe('Peter van Vliet');
            expect(peter.age).toBe(24);
        });
    });

    describe('.isClassObject(object)', () =>
    {
        it('should detect a class object', () =>
        {
            const result = reflector.isClassObject(OBJECTS.CLASS);
            expect(result).toBe(true);
        });

        it('should detect a non class object', () =>
        {
            const result = reflector.isClassObject(OBJECTS.PLAIN);
            expect(result).toBe(false);
        });
    });

    describe('.getClass(object)', () =>
    {
        it('should get the class of an object', () =>
        {
            const result = reflector.getClass(OBJECTS.CLASS);

            expect(result.name).toBe('Child');
        });
    });

    describe('.getParentClass(object)', () =>
    {
        it('should get the parent of a class', () =>
        {
            const result = reflector.getParentClass(CLASSES.Child);

            expect(result.name).toBe('Parent');
        });
    });
});
