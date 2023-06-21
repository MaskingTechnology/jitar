
import { describe, expect, it } from 'vitest';

import UrlSerializer from '../../src/serializers/UrlSerializer';
import InvalidUrlString from '../../src/serializers/errors/InvalidUrlString';

import
{
    validUrl,
    serializedValidUrl,
    nonObject, nonUrl, notSerialized, invalidName, invalidUrlValue, invalidUrlString
} from '../_fixtures/serializers/UrlSerializer.fixture';

const serializer = new UrlSerializer();

describe('serializers/UrlSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an url', () =>
        {
            const supportsUrl = serializer.canSerialize(validUrl);

            expect(supportsUrl).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonUrl = serializer.canSerialize(nonUrl);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonUrl).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an url', () =>
        {
            const supportsUrl = serializer.canDeserialize(serializedValidUrl);

            expect(supportsUrl).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidUrlValue = serializer.canDeserialize(invalidUrlValue);

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
            const resultValidUrl = await serializer.serialize(validUrl);

            expect(resultValidUrl).toStrictEqual(serializedValidUrl);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an url', async () =>
        {
            const resultValidUrl = await serializer.deserialize(serializedValidUrl);

            expect(resultValidUrl).toStrictEqual(validUrl);
        });

        it('should not deserialize an url with an invalid url string', async () =>
        {
            const deserialize = async () => serializer.deserialize(invalidUrlString);

            expect(deserialize).rejects.toStrictEqual(new InvalidUrlString('example'));
        });
    });
});
