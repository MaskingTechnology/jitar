
import { Reflector } from 'jitar-reflection';

import ValueSerializer from '../ValueSerializer.js';
import SerializedTypedArray from '../types/serialized/SerializedTypedArray.js';
import TypedArray from '../types/TypedArray.js';
import FlexObject from '../types/FlexObject.js';

const reflector = new Reflector();

export default class ArrayBufferSerializer extends ValueSerializer
{
    canSerialize(data: unknown): boolean
    {
        return (data instanceof Int8Array)
            || (data instanceof Uint8Array)
            || (data instanceof Uint8ClampedArray)
            || (data instanceof Int16Array)
            || (data instanceof Uint16Array)
            || (data instanceof Int32Array)
            || (data instanceof Uint32Array)
            || (data instanceof Float32Array)
            || (data instanceof Float64Array)
            || (data instanceof BigInt64Array)
            || (data instanceof BigUint64Array);
    }

    canDeserialize(data: unknown): boolean
    {
        if ((data instanceof Object) === false)
        {
            return false;
        }
        
        const array = data as SerializedTypedArray;

        return array.serialized === true
            && array.name === 'TypedArray'
            && array.type in globalThis
            && array.bytes instanceof Array;  
    }
    
    async serialize(data: TypedArray): Promise<SerializedTypedArray>
    {
        const type = data.constructor.name;
        const view = new DataView(data.buffer);
        const bytes: number[] = [];

        for (let index = 0; index < view.byteLength; index++)
        {
            bytes.push(view.getUint8(index));
        }

        const returnvalue = { serialized: true, name: 'TypedArray', type: type, bytes: bytes };

        return returnvalue;
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

        const clazz = (globalThis as FlexObject)[type] as Function;

        return reflector.createInstance(clazz, [buffer]) as TypedArray;
    }
}
