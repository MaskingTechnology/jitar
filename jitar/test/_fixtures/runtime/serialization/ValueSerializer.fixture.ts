
import Component from "../../../../src/core/types/Component";

const IMPORT_URL = '../../../test/_fixtures/runtime/serialization/ValueSerializer.fixture';

export class Data
{
    a?: number;
    b?: boolean;
}

(Data as Component).source = IMPORT_URL;

export class Constructed
{
    #a: number;
    #b: boolean;
    #c?: string;

    constructor(a: number, b: boolean)
    {
        this.#a = a;
        this.#b = b;
    }

    get a() { return this.#a; }

    get b() { return this.#b; }

    get c() { return this.#c; }

    set c(c) { this.#c = c; }
}

(Constructed as Component).source = IMPORT_URL;

export class Nested
{
    name: string;
    #constructed: Constructed;

    constructor(name: string, constructed: Constructed)
    {
        this.name = name;
        this.#constructed = constructed;
    }

    get constructed() { return this.#constructed; }
}

(Nested as Component).source = IMPORT_URL;

export class PrivateFieldClass
{
    #a: number;
    #b: boolean;
    c?: string;

    constructor(a: number, b: boolean)
    {
        this.#a = a;
        this.#b = b;
    }

    get d() { return this.#a; }
}

(PrivateFieldClass as Component).source = IMPORT_URL;

const errorClass = new Error('hello');
errorClass.stack = 'stacktrace';

const numberValue = 1;
const boolValue = true;
const stringValue = 'hello';
const nullValue = null;
const undefinedValue = undefined;

const emptyArray: unknown[] = [];
const mixedArray: unknown[] = ['a', 1, true];
const nestedArray: unknown[] = ['b', 2, ['c', false], true];

const emptyObject: unknown = {};
const mixedObject: unknown = { a: 1, b: true, c: 'hello' };
const nestedObject: unknown = { a: 1, b: true, c: { d: false, e: true } };

const fixedDate = new Date('2021-01-01T00:00:00.000Z');
const serializedFixedDate = { serialized: true, name: 'Date', value: '2021-01-01T00:00:00.000Z' };
const serializedInvalidDateValue = { serialized: true, name: 'Date', value: true };
const serializedInvalidDateString = { serialized: true, name: 'Date', value: 'hello' };

const emptyMap: Map<unknown, unknown> = new Map();
const mixedMap: Map<unknown, unknown> = new Map().set('a', 1).set('b', true);
const nestedMap: Map<unknown, unknown> = new Map().set('b', 'hello').set('c', new Map().set('d', false));

const serializedEmptyMap = { serialized: true, name: 'Map', entries: { keys: [], values: [] } };
const serializedMixedMap = { serialized: true, name: 'Map', entries: { keys: ['a', 'b'], values: [1, true] } }
const serializedNestedMap = { serialized: true, name: 'Map', entries: { keys: ['b', 'c'], values: ['hello', { serialized: true, name: 'Map', entries: { keys: ['d'], values: [false] } }] } }

const emptySet: Set<unknown> = new Set();
const mixedSet: Set<unknown> = new Set().add(1).add(true);
const nestedSet: Set<unknown> = new Set().add('hello').add(new Set().add(false));

const serializedEmptySet = { serialized: true, name: 'Set', values: [] };
const serializedMixedSet = { serialized: true, name: 'Set', values: [1, true] };
const serializedNestedSet = { serialized: true, name: 'Set', values: ['hello', { serialized: true, name: 'Set', values: [false] }] };

const serializedError = { serialized: true, name: 'Error', source: null, args: [], fields: { stack: 'stacktrace', message: 'hello' } };

const dataClass = new Data();
dataClass.a = 1;
dataClass.b = true;

const constructedClass = new Constructed(1, true);
constructedClass.c = 'hello';

const nestedClass = new Nested('hello', constructedClass);
const privateClass = new PrivateFieldClass(1, true);

const serializedDataClass = { serialized: true, name: 'Data', source: IMPORT_URL, args: [], fields: { a: 1, b: true } };
const serializedConstructedClass = { serialized: true, name: 'Constructed', source: IMPORT_URL, args: [1, true], fields: { c: 'hello' } };
const serializedNestedClass = { serialized: true, name: 'Nested', source: IMPORT_URL, args: ['hello', { serialized: true, name: 'Constructed', source: IMPORT_URL, args: [1, true], fields: { c: 'hello' } }], fields: {} };
const serializedPrivateClass = { serialized: true, name: 'PrivateFieldClass', source: IMPORT_URL, args: [], fields: { c: undefined } };

const serializedInvalidClass = { serialized: true, name: 'Invalid', source: null, args: [], fields: {} };
const serializedUnserializableClass = { serialized: true, name: 'Infinity', source: null, args: [], fields: {} };

export
{
    numberValue, boolValue, stringValue, nullValue, undefinedValue,
    emptyArray, mixedArray, nestedArray,
    emptyObject, mixedObject, nestedObject,
    fixedDate, serializedFixedDate, serializedInvalidDateValue, serializedInvalidDateString,
    emptyMap, mixedMap, nestedMap, serializedEmptyMap, serializedMixedMap, serializedNestedMap,
    emptySet, mixedSet, nestedSet, serializedEmptySet, serializedMixedSet, serializedNestedSet,
    dataClass, constructedClass, nestedClass, serializedDataClass, serializedConstructedClass, serializedNestedClass,
    serializedInvalidClass, serializedUnserializableClass,
    privateClass, serializedPrivateClass,
    errorClass, serializedError
}
