
import ValueSerializer from '../ValueSerializer';
import SerializedUrl from '../types/serialized/SerializedUrl';
import InvalidUrlString from './errors/InvalidUrlString';

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
        catch
        {
            throw new InvalidUrlString(object.value);
        }
    }
}
