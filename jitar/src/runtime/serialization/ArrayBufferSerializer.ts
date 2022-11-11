
import Serializer from './interfaces/Serializer.js';
import SerializedArrayBuffer from './types/SerializedArrayBuffer.js';
import TypedArray from './types/TypedArray.js';
import Module from '../../core/types/Module.js';
import ReflectionHelper from '../../core/reflection/ReflectionHelper.js';

class ArrayBufferSerializer implements Serializer
{
    serialize(data: TypedArray): SerializedArrayBuffer
    {
        const type = data.constructor.name;
        const view = new DataView(data.buffer);
        const bytes: number[] = [];

        for (let index = 0; index < view.byteLength; index++)
        {
            bytes.push(view.getUint8(index));
        }

        const returnvalue = { serialized: true, name: 'ArrayBuffer', type: type, bytes: bytes };

        return returnvalue;
    }

    async deserialize(object: SerializedArrayBuffer): Promise<TypedArray>
    {
        const type = object.type;
        const bytes = object.bytes;
        const buffer = new ArrayBuffer(bytes.length);
        const view = new DataView(buffer);

        for (let index = 0; index < bytes.length; index++)
        {
            view.setUint8(index, bytes[index]);
        }

        const clazz = (globalThis as Module)[type] as Function;

        return ReflectionHelper.createInstance(clazz, [buffer]) as TypedArray;
    }
}

const instance = new ArrayBufferSerializer();

export default instance;
