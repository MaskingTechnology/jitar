
import ValueSerializer from '../ValueSerializer';
import SerializedBuffer from '../types/serialized/SerializedBuffer';
import InvalidBufferString from './errors/InvalidBufferString';

export default class BufferSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Buffer;
    }

    canDeserialize(value: unknown): boolean
    {
        const buffer = value as SerializedBuffer;

        return buffer instanceof Object
            && buffer.serialized === true
            && buffer.name === 'Buffer'
            && typeof buffer.base64 === 'string';
    }

    async serialize(buffer: Buffer): Promise<SerializedBuffer>
    {
        return { serialized: true, name: 'Buffer', base64: buffer.toString('base64') };
    }

    async deserialize(object: SerializedBuffer): Promise<Buffer>
    {
        try
        {
            return Buffer.from(object.base64, 'base64');
        }
        catch
        {
            throw new InvalidBufferString(object.base64);
        }
    }
}
