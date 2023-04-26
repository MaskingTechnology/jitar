
import ValueSerializer from '../ValueSerializer.js';
import SerializedUrl from '../types/serialized/SerializedUrl.js';
import InvalidUrlString from './errors/InvalidUrlString.js';

export default class UrlSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof URL;
    }

    canDeserialize(value: unknown): boolean
    {
        const url = value as SerializedUrl;

        return url instanceof Object
            && url.serialized === true
            && url.name === 'Url'
            && typeof url.value === 'string';
    }

    async serialize(url: URL): Promise<SerializedUrl>
    {
        return { serialized: true, name: 'Url', value: url.toString() };
    }

    async deserialize(object: SerializedUrl): Promise<URL>
    {
        try
        {
            return new URL(object.value);
        }
        catch (error)
        {
            throw new InvalidUrlString(object.value);
        }
    }
}
