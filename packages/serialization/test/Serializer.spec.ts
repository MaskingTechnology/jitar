
import { describe, expect, it } from 'vitest';

import Serializer from '../src/Serializer';
import NoSerializerFound from '../src/errors/NoSerializerFound';
import NoDeserializerFound from '../src/errors/NoDeserializerFound';

import
    {
        FirstSerializer, SecondSerializer,
        NumberSerializer, StringSerializer
    } from './_fixtures/Serializer.fixture';

const overrideSerializer = new Serializer();
overrideSerializer.addSerializer(new FirstSerializer());
overrideSerializer.addSerializer(new SecondSerializer());

const typeSerializer = new Serializer();
typeSerializer.addSerializer(new NumberSerializer());
typeSerializer.addSerializer(new StringSerializer());

describe('Serializer', () =>
{
    describe('.serialize(value)', () =>
    {
        it('should use the last added applicable serializer', async () =>
        {
            const result = await overrideSerializer.serialize(42);

            expect(result).toBe(2);
        });

        it('should use the applicable serializer for a specific value type', async () =>
        {
            const resultNumber = await typeSerializer.serialize(42);
            const resultString = await typeSerializer.serialize('42');

            expect(resultNumber).toEqual(42);
            expect(resultString).toEqual('42');
        });

        it('should throw error when no applicable serializer is found', async () =>
        {
            const serialize = async () => typeSerializer.serialize(true);

            expect(serialize).rejects.toStrictEqual(new NoSerializerFound('boolean'));
        });
    });

    describe('.deserialize(value)', () =>
    {
        it('should use the last added applicable deserializer', async () =>
        {
            const result = await overrideSerializer.deserialize(42);

            expect(result).toEqual(2);
        });

        it('should use the applicable deserializer for a specific value type', async () =>
        {
            const resultNumber = await typeSerializer.deserialize(42);
            const resultString = await typeSerializer.deserialize('42');

            expect(resultNumber).toEqual(42);
            expect(resultString).toEqual('42');
        });

        it('should throw error when no applicable deserializer is found', async () =>
        {
            const deserialize = async () => typeSerializer.deserialize(true);

            expect(deserialize).rejects.toStrictEqual(new NoDeserializerFound('boolean'));
        });
    });
});
