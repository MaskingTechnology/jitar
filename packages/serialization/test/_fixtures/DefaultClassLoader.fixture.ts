
import * as url from 'url';

import Loadable from '../../src/types/Loadable';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class Person {}

class Customer extends Person {}

const primitive = 42;

const personLoadable: Loadable =
{ 
    name: 'Person',
    source: `${__dirname}DefaultClassLoader.fixture.ts`
};

const customerLoadable: Loadable =
{
    name: 'Customer',
    source: `${__dirname}DefaultClassLoader.fixture.ts`
};

const primitiveLoadable: Loadable =
{
    name: 'primitive',
    source: `${__dirname}DefaultClassLoader.fixture.ts`
};

const nonexistingLoadable: Loadable =
{
    name: 'nonexisting',
    source: `${__dirname}DefaultClassLoader.fixture.ts`
};

const invalidLoadable: Loadable =
{
    name: 'invalid',
    source: null
};

export {
    Person, Customer, primitive,
    personLoadable, customerLoadable, primitiveLoadable,
    nonexistingLoadable, invalidLoadable
};
