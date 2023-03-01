
import { Reflector } from 'jitar-reflection';

import ValueSerializer from '../ValueSerializer.js';
import SerializedArrayBuffer from '../types/serialized/SerializedArrayBuffer.js';
import TypedArray from '../types/TypedArray.js';
import FlexObject from '../types/FlexObject.js';

const reflector = new Reflector();

export default class ArrayBufferSerializer extends ValueSerializer
{
    canSerialize(data: unknown): boolean
    {
        return data instanceof ArrayBuffer;
    }

    canDeserialize(value: unknown): boolean
    {
        const buffer = value as SerializedArrayBuffer;

        return buffer.serialized === true
            && buffer.name === 'ArrayBuffer'
            && buffer.type in globalThis
            && buffer.bytes instanceof Array;  
    }
    
    async serialize(data: TypedArray): Promise<SerializedArrayBuffer>
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

        const clazz = (globalThis as FlexObject)[type] as Function;

        return reflector.createInstance(clazz, [buffer]) as TypedArray;
    }
}
