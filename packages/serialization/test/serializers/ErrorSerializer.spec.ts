
import { describe, expect, it } from 'vitest';

import ErrorSerializer from '../../src/serializers/ErrorSerializer';

import { ERRORS } from './fixtures';

const serializer = new ErrorSerializer();

describe('serializers/ErrorSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an error', () =>
        {
            const supportsPlainError = serializer.canSerialize(ERRORS.PLAIN);
            const supportsEvalError = serializer.canSerialize(ERRORS.EVAL);
            const supportsRangeError = serializer.canSerialize(ERRORS.RANGE);
            const supportsReferenceError = serializer.canSerialize(ERRORS.REFERENCE);
            const supportsSyntaxError = serializer.canSerialize(ERRORS.SYNTAX);
            const supportsTypeError = serializer.canSerialize(ERRORS.TYPE);
            const supportsURIError = serializer.canSerialize(ERRORS.URI);

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
            const supportsCustomError = serializer.canSerialize(ERRORS.CUSTOM);
            const supportsOtherClass = serializer.canSerialize(ERRORS.OTHER_CLASS);
            const supportsNotSerialized = serializer.canDeserialize(ERRORS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(ERRORS.INVALID_NAME);
            const supportsInvalidType = serializer.canDeserialize(ERRORS.INVALID_TYPE);

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
            const resultPlainError = await serializer.serialize(ERRORS.PLAIN);
            const resultEvalError = await serializer.serialize(ERRORS.EVAL);
            const resultRangeError = await serializer.serialize(ERRORS.RANGE);
            const resultReferenceError = await serializer.serialize(ERRORS.REFERENCE);
            const resultSyntaxError = await serializer.serialize(ERRORS.SYNTAX);
            const resultTypeError = await serializer.serialize(ERRORS.TYPE);
            const resultURIError = await serializer.serialize(ERRORS.URI);

            expect(resultPlainError).toStrictEqual(ERRORS.PLAIN_SERIALIZED);
            expect(resultEvalError).toStrictEqual(ERRORS.EVAL_SERIALIZED);
            expect(resultRangeError).toStrictEqual(ERRORS.RANGE_SERIALIZED);
            expect(resultReferenceError).toStrictEqual(ERRORS.REFERENCE_SERIALIZED);
            expect(resultSyntaxError).toStrictEqual(ERRORS.SYNTAX_SERIALIZED);
            expect(resultTypeError).toStrictEqual(ERRORS.TYPE_SERIALIZED);
            expect(resultURIError).toStrictEqual(ERRORS.URI_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an error', async () =>
        {
            const resultPlainError = await serializer.deserialize(ERRORS.PLAIN_SERIALIZED);
            const resultEvalError = await serializer.deserialize(ERRORS.EVAL_SERIALIZED);
            const resultRangeError = await serializer.deserialize(ERRORS.RANGE_SERIALIZED);
            const resultReferenceError = await serializer.deserialize(ERRORS.REFERENCE_SERIALIZED);
            const resultSyntaxError = await serializer.deserialize(ERRORS.SYNTAX_SERIALIZED);
            const resultTypeError = await serializer.deserialize(ERRORS.TYPE_SERIALIZED);
            const resultURIError = await serializer.deserialize(ERRORS.URI_SERIALIZED);

            expect(resultPlainError).toStrictEqual(ERRORS.PLAIN);
            expect(resultEvalError).toStrictEqual(ERRORS.EVAL);
            expect(resultRangeError).toStrictEqual(ERRORS.RANGE);
            expect(resultReferenceError).toStrictEqual(ERRORS.REFERENCE);
            expect(resultSyntaxError).toStrictEqual(ERRORS.SYNTAX);
            expect(resultTypeError).toStrictEqual(ERRORS.TYPE);
            expect(resultURIError).toStrictEqual(ERRORS.URI);
        });
    });
});
