
import { describe, expect, it } from 'vitest';

import BufferSerializer from '../../src/serializers/BufferSerializer';

import { BUFFERS } from './fixtures';

const serializer = new BufferSerializer();

describe('serializers/BufferSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a buffer', () =>
        {
            const supportsBuffer = serializer.canSerialize(BUFFERS.VALID);

            expect(supportsBuffer).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(BUFFERS.NON_OBJECT);
            const supportsNonBuffer = serializer.canSerialize(BUFFERS.NON_BUFFER);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonBuffer).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a buffer', () =>
        {
            const supportsBuffer = serializer.canDeserialize(BUFFERS.VALID_SERIALIZED);

            expect(supportsBuffer).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(BUFFERS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(BUFFERS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(BUFFERS.INVALID_NAME);
            const supportsInvalidBufferValue = serializer.canDeserialize(BUFFERS.INVALID_BUFFER_VALUE);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidBufferValue).toBeFalsy();
        });
    });

    describe('.serialize(buffer)', () =>
    {
        it('should serialize a buffer', async () =>
        {
            const resultValidBuffer = await serializer.serialize(BUFFERS.VALID);

            expect(resultValidBuffer).toStrictEqual(BUFFERS.VALID_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a buffer', async () =>
        {
            const resultValidBuffer = await serializer.deserialize(BUFFERS.VALID_SERIALIZED);

            expect(resultValidBuffer).toStrictEqual(BUFFERS.VALID);
        });

        it('should ignore invalid characters in buffer string', async () =>
        {
            const resultInvalidBuffer = await serializer.deserialize(BUFFERS.INVALID_BUFFER_STRING);

            expect(resultInvalidBuffer).toStrictEqual(BUFFERS.VALID);
        });
    });
});
