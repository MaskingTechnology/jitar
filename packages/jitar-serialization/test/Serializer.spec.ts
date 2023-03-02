
import { describe, expect, it } from 'vitest';

import Serializer from '../src/Serializer';

import {
    FirstSerializer, SecondSerializer,
    NumberSerializer, StringSerializer
} from './_fixtures/Serializer.fixture';

describe('serializers/ErrorSerializer', () =>
{
    describe('.serialize(value)', () =>
    {
        it('should use the applicable serializer for a specific value type', async () =>
        {
            const serializer = new Serializer();
            serializer.addSerializer(new NumberSerializer());
            serializer.addSerializer(new StringSerializer());

            const resultNumber = await serializer.serialize(42);
            const resultString = await serializer.serialize('42');

            expect(resultNumber).toBe(42);
            expect(resultString).toBe('42');
        });

        it('should use the last added applicable serializer', async () =>
        {
            const serializer = new Serializer();
            serializer.addSerializer(new FirstSerializer());
            serializer.addSerializer(new SecondSerializer());

            const result = await serializer.serialize(42);

            expect(result).toBe(2);
        });
    });
});
