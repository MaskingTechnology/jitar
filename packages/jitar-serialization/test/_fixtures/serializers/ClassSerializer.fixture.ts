
import ClassLoader from '../../../src/interfaces/ClassLoader';
import Loadable from '../../../src/types/Loadable';

class Data
{
    a?: number;
    b?: boolean;
}

(Data as Loadable).source = Data.name;

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

(Constructed as Loadable).source = Constructed.name;

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

(Nested as Loadable).source = Nested.name;

class PrivateFieldClass
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

(PrivateFieldClass as Loadable).source = PrivateFieldClass.name;

class MockClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        switch (loadable.source)
        {
            case 'Data': return Data;
            case 'Constructed': return Constructed;
            case 'Nested': return Nested;
            case 'PrivateFieldClass': return PrivateFieldClass;
        }

        throw new Error(`Unknown class: ${loadable.source}`);
    }
}

const dataClass = new Data();
dataClass.a = 1;
dataClass.b = true;

const constructedClass = new Constructed(1, true);
constructedClass.c = 'hello';

const nestedClass = new Nested('hello', constructedClass);
const privateClass = new PrivateFieldClass(1, true);

const serializedDataClass = { serialized: true, name: 'Data', source: 'Data', args: [], fields: { a: 1, b: true } };
const serializedConstructedClass = { serialized: true, name: 'Constructed', source: 'Constructed', args: [1, true], fields: { c: 'hello' } };
const serializedNestedClass = { serialized: true, name: 'Nested', source: 'Nested', args: ['hello', { serialized: true, name: 'Constructed', source: 'Constructed', args: [1, true], fields: { c: 'hello' } }], fields: {} };
const serializedPrivateClass = { serialized: true, name: 'PrivateFieldClass', source: 'PrivateFieldClass', args: [undefined, undefined], fields: { c: undefined } };

const serializedInvalidClass = { serialized: true, name: 'Invalid', source: null, args: [], fields: {} };
const serializedUnserializableClass = { serialized: true, name: 'Infinity', source: null, args: [], fields: {} };

export {
    Data, Constructed, Nested, PrivateFieldClass, MockClassLoader,
    dataClass, constructedClass, nestedClass, privateClass,
    serializedDataClass, serializedConstructedClass, serializedNestedClass, serializedPrivateClass, serializedInvalidClass, serializedUnserializableClass
}
