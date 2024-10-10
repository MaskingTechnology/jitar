
class Data
{
    a?: number;
    b?: boolean;
}

class Constructed
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

class Nested
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

class PrivateFieldClass
{
    #a: number;
    // eslint-disable-next-line no-unused-private-class-members, sonarjs/no-unused-private-class-members
    #b: boolean;
    // eslint-disable-next-line no-unused-private-class-members, sonarjs/no-unused-private-class-members
    #c?: string;

    constructor(a: number, b: boolean, c?: string)
    {
        this.#a = a;
        this.#b = b;
        this.#c = c;
    }

    get d() { return this.#a; }
}

const dataClass = new Data();
dataClass.a = 1;
dataClass.b = true;

const constructedClass = new Constructed(1, true);
constructedClass.c = 'hello';

const nestedClass = new Nested('hello', constructedClass);
const privateClass = new PrivateFieldClass(1, true);

const serializedDataClass = { serialized: true, name: 'class', key: 'Data', args: {}, fields: { a: 1, b: true } };
const serializedConstructedClass = { serialized: true, name: 'class', key: 'Constructed', args: { '0': 1, '1': true }, fields: { c: 'hello' } };
const serializedNestedClass = { serialized: true, name: 'class', key: 'Nested', args: { '0': 'hello', '1': { serialized: true, name: 'class', key: 'Constructed', args: { '0': 1, '1': true }, fields: { c: 'hello' } } }, fields: {} };
const serializedPrivateClass = { serialized: true, name: 'class', key: 'PrivateFieldClass', args: { '0': undefined, '1': undefined, '2': undefined }, fields: {  } };

const serializedInvalidClass = { serialized: true, name: 'class', key: 'Invalid', args: {}, fields: {} };
const serializedUnserializableClass = { serialized: true, name: 'class', key: 'Infinity', args: {}, fields: {} };

const nonObject = 42;
const nonClassObject = new Object();
const notSerialized = { name: 'class', key: 'Unserialized', args: {}, fields: {} };
const invalidKey = { serialized: true, name: 'class', key: 123, args: {}, fields: {} };
const invalidArgs = { serialized: true, name: 'class', key: 'Invalid', args: [], fields: {} };
const invalidFields = { serialized: true, name: 'class', key: 'Invalid', args: {}, fields: [] };

export const CLASSES =
{
    Data, Constructed, Nested, PrivateFieldClass,
    DATA_INSTANCE: dataClass,
    DATA_SERIALIZED: serializedDataClass,
    CONSTRUCTED_INSTANCE: constructedClass,
    CONSTRUCTED_SERIALIZED: serializedConstructedClass,
    NESTED_INSTANCE: nestedClass,
    NESTED_SERIALIZED: serializedNestedClass,
    PRIVATE_INSTANCE: privateClass,
    PRIVATE_SERIALIZED: serializedPrivateClass,
    INVALID_SERIALIZED: serializedInvalidClass,
    UNSERIALIZABLE: serializedUnserializableClass,
    NON_OBJECT: nonObject,
    NON_CLASS_OBJECT: nonClassObject,
    NOT_SERIALIZED: notSerialized,
    INVALID_KEY: invalidKey,
    INVALID_ARGS: invalidArgs,
    INVALID_FIELDS: invalidFields
};
