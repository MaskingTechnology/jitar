
import { describe, expect, it } from 'vitest';

import DefaultClassLoader from '../src/DefaultClassLoader';
import ClassNotFound from '../src/errors/ClassNotFound';
import InvalidClass from '../src/errors/InvalidClass';

import { 
    Person, Customer,
    personLoadable, customerLoadable, primitiveLoadable,
    nonexistingLoadable, invalidLoadable
} from './_fixtures/DefaultClassLoader.fixture';

const loader = new DefaultClassLoader();

describe('DefaultClassLoader', () =>
{
    describe('.loadClass(loadable)', () =>
    {
        it('should load classes', async () =>
        {
            const person = await loader.loadClass(personLoadable);
            const customer = await loader.loadClass(customerLoadable);

            expect(person).toBe(Person);
            expect(customer).toBe(Customer);
        });

        it('should not load non-class types', async () =>
        {
            const loadClass = async () => await loader.loadClass(primitiveLoadable);

            expect(loadClass).rejects.toStrictEqual(new InvalidClass('primitive'));
        });

        it('should not load non-existing classes', async () =>
        {
            const loadClass = async () => await loader.loadClass(nonexistingLoadable);

            expect(loadClass).rejects.toStrictEqual(new ClassNotFound('nonexisting'));
        });

        it('should not load from invalid sources', async () =>
        {
            const loadClass = async () => await loader.loadClass(invalidLoadable);

            expect(loadClass).rejects.toStrictEqual(new ClassNotFound('invalid'));
        });
    });
});
