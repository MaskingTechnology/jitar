
import { Reflector } from '@jitar/reflection';

import ValueSerializer from '../ValueSerializer.js';
import SerializedTypedArray from '../types/serialized/SerializedTypedArray.js';
import TypedArray from '../types/TypedArray.js';

const reflector = new Reflector();

export default class ArrayBufferSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return (value instanceof Int8Array)
            || (value instanceof Uint8Array)
            || (value instanceof Uint8ClampedArray)
            || (value instanceof Int16Array)
            || (value instanceof Uint16Array)
            || (value instanceof Int32Array)
            || (value instanceof Uint32Array)
            || (value instanceof Float32Array)
            || (value instanceof Float64Array)
            || (value instanceof BigInt64Array)
            || (value instanceof BigUint64Array);
    }

    canDeserialize(value: unknown): boolean
    {
        const array = value as SerializedTypedArray;

        return array instanceof Object
            && array.serialized === true
            && array.name === 'TypedArray'
            && array.type in globalThis
            && array.bytes instanceof Array;  
    }
    
    async serialize(array: TypedArray): Promise<SerializedTypedArray>
    {
        const type = array.constructor.name;
        const view = new DataView(array.buffer);
        const bytes: number[] = [];

        for (let index = 0; index < view.byteLength; index++)
        {
            bytes.push(view.getUint8(index));
        }

        return { serialized: true, name: 'TypedArray', type: type, bytes: bytes };
    }

    async deserialize(object: SerializedTypedArray): Promise<TypedArray>
    {
        const type = object.type;
        const bytes = object.bytes;
        const buffer = new ArrayBuffer(bytes.length);
        const view = new DataView(buffer);

        for (let index = 0; index < bytes.length; index++)
        {
            view.setUint8(index, bytes[index]);
        }

        const clazz = (globalThis as Record<string, unknown>)[type] as Function;

        return reflector.createInstance(clazz, [buffer]) as TypedArray;
    }
}
