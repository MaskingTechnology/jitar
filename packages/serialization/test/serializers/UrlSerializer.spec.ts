
import { describe, expect, it } from 'vitest';

import UrlSerializer from '../../src/serializers/UrlSerializer';
import InvalidUrlString from '../../src/serializers/errors/InvalidUrlString';

import { URLS } from './fixtures';

const serializer = new UrlSerializer();

describe('serializers/UrlSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an url', () =>
        {
            const supportsUrl = serializer.canSerialize(URLS.VALID);

            expect(supportsUrl).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(URLS.NON_OBJECT);
            const supportsNonUrl = serializer.canSerialize(URLS.NON_URL);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonUrl).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an url', () =>
        {
            const supportsUrl = serializer.canDeserialize(URLS.VALID_SERIALIZED);

            expect(supportsUrl).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(URLS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(URLS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(URLS.INVALID_NAME);
            const supportsInvalidUrlValue = serializer.canDeserialize(URLS.INVALID_URL_VALUE);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidUrlValue).toBeFalsy();
        });
    });

    describe('.serialize(url)', () =>
    {
        it('should serialize a url', async () =>
        {
            const resultValidUrl = await serializer.serialize(URLS.VALID);

            expect(resultValidUrl).toStrictEqual(URLS.VALID_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an url', async () =>
        {
            const resultValidUrl = await serializer.deserialize(URLS.VALID_SERIALIZED);

            expect(resultValidUrl).toStrictEqual(URLS.VALID);
        });

        it('should not deserialize an url with an invalid url string', async () =>
        {
            const deserialize = async () => serializer.deserialize(URLS.INVALID_URL_STRING);

            expect(deserialize).rejects.toStrictEqual(new InvalidUrlString('example'));
        });
    });
});
