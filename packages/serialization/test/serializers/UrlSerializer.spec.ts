
import { describe, expect, it } from 'vitest';

import UrlSerializer from '../../src/serializers/UrlSerializer';
import InvalidUrlString from '../../src/serializers/errors/InvalidUrlString';

import
{
    validURL,
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
            const supportsDate = serializer.canSerialize(validURL);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonDate = serializer.canSerialize(nonUrl);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonDate).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an url', () =>
        {
            const supportsDate = serializer.canDeserialize(serializedValidUrl);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidDateValue = serializer.canDeserialize(invalidUrlValue);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidDateValue).toBeFalsy();
        });
    });

    describe('.serialize(url)', () =>
    {
        it('should serialize a url', async () =>
        {
            const resultFixedDate = await serializer.serialize(validURL);

            expect(resultFixedDate).toStrictEqual(serializedValidUrl);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an url', async () =>
        {
            const resultFixedDate = await serializer.deserialize(serializedValidUrl);

            expect(resultFixedDate).toStrictEqual(validURL);
        });

        it('should not deserialize an url with an invalid url string', async () =>
        {
            const deserialize = async () => serializer.deserialize(invalidUrlString);

            expect(deserialize).rejects.toStrictEqual(new InvalidUrlString('example'));
        });
    });
});
