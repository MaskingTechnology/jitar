
import { describe, expect, it } from 'vitest';

import ErrorSerializer from '../../src/serializers/ErrorSerializer';

import {
    plainError, evalError, rangeError, referenceError, syntaxError, typeError, uriError,
    serializedPlainError, serializedEvalError, serializedRangeError, serializedReferenceError, serializedSyntaxError, serializedTypeError, serializedURIError,
    customError, otherClass,
    notSerialized, invalidName, invalidType
} from '../_fixtures/serializers/ErrorSerializer.fixture';

const serializer = new ErrorSerializer();

describe('serializers/ErrorSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an error', () =>
        {
            const supportsPlainError = serializer.canSerialize(plainError);
            const supportsEvalError = serializer.canSerialize(evalError);
            const supportsRangeError = serializer.canSerialize(rangeError);
            const supportsReferenceError = serializer.canSerialize(referenceError);
            const supportsSyntaxError = serializer.canSerialize(syntaxError);
            const supportsTypeError = serializer.canSerialize(typeError);
            const supportsURIError = serializer.canSerialize(uriError);

            expect(supportsPlainError).toBeTruthy();
            expect(supportsEvalError).toBeTruthy();
            expect(supportsRangeError).toBeTruthy();
            expect(supportsReferenceError).toBeTruthy();
            expect(supportsSyntaxError).toBeTruthy();
            expect(supportsTypeError).toBeTruthy();
            expect(supportsURIError).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsCustomError = serializer.canSerialize(customError);
            const supportsOtherClass = serializer.canSerialize(otherClass);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidType = serializer.canDeserialize(invalidType);

            expect(supportsCustomError).toBeFalsy();
            expect(supportsOtherClass).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidType).toBeFalsy();
        });
    });

    describe('.serialize(map)', () =>
    {
        it('should serialize an error', async () =>
        {
            const resultPlainError = await serializer.serialize(plainError);
            const resultEvalError = await serializer.serialize(evalError);
            const resultRangeError = await serializer.serialize(rangeError);
            const resultReferenceError = await serializer.serialize(referenceError);
            const resultSyntaxError = await serializer.serialize(syntaxError);
            const resultTypeError = await serializer.serialize(typeError);
            const resultURIError = await serializer.serialize(uriError);

            expect(resultPlainError).toStrictEqual(serializedPlainError);
            expect(resultEvalError).toStrictEqual(serializedEvalError);
            expect(resultRangeError).toStrictEqual(serializedRangeError);
            expect(resultReferenceError).toStrictEqual(serializedReferenceError);
            expect(resultSyntaxError).toStrictEqual(serializedSyntaxError);
            expect(resultTypeError).toStrictEqual(serializedTypeError);
            expect(resultURIError).toStrictEqual(serializedURIError);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an error', async () =>
        {
            const resultPlainError = await serializer.deserialize(serializedPlainError);
            const resultEvalError = await serializer.deserialize(serializedEvalError);
            const resultRangeError = await serializer.deserialize(serializedRangeError);
            const resultReferenceError = await serializer.deserialize(serializedReferenceError);
            const resultSyntaxError = await serializer.deserialize(serializedSyntaxError);
            const resultTypeError = await serializer.deserialize(serializedTypeError);
            const resultURIError = await serializer.deserialize(serializedURIError);

            expect(resultPlainError).toStrictEqual(plainError);
            expect(resultEvalError).toStrictEqual(evalError);
            expect(resultRangeError).toStrictEqual(rangeError);
            expect(resultReferenceError).toStrictEqual(referenceError);
            expect(resultSyntaxError).toStrictEqual(syntaxError);
            expect(resultTypeError).toStrictEqual(typeError);
            expect(resultURIError).toStrictEqual(uriError);
        });
    });
});
