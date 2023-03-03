
import { describe, expect, it } from 'vitest';

import SerializerBuilder from '../src/SerializerBuilder';

import {
    classLoader,
    mixedArray, mixedObject,
    dataClass, serializedDataClass,
    fixedDate, serializedFixedDate,
    mixedMap, serializedMixedMap,
    mixedSet, serializedMixedSet,
    viewInt8, serializedViewInt8,
    stringValue
} from './_fixtures/SerializerBuilder.fixture';

const serializer = SerializerBuilder.build(classLoader);

describe('SerializerBuilder', () =>
{
    it('should serialize mixed types with the build serializer', async () =>
    {
        const resultArray = await serializer.serialize(mixedArray);
        const resultObject = await serializer.serialize(mixedObject);
        const resultClass = await serializer.serialize(dataClass);
        const resultDate = await serializer.serialize(fixedDate);
        const resultMap = await serializer.serialize(mixedMap);
        const resultSet = await serializer.serialize(mixedSet);
        const resultView = await serializer.serialize(viewInt8);
        const resultString = await serializer.serialize(stringValue);

        expect(resultArray).toStrictEqual(mixedArray);
        expect(resultObject).toStrictEqual(mixedObject);
        expect(resultClass).toStrictEqual(serializedDataClass);
        expect(resultDate).toStrictEqual(serializedFixedDate);
        expect(resultMap).toStrictEqual(serializedMixedMap);
        expect(resultSet).toStrictEqual(serializedMixedSet);
        expect(resultView).toStrictEqual(serializedViewInt8);
        expect(resultString).toStrictEqual(stringValue);
    });

    it('should deserialize mixed types with the build serializer', async () =>
    {
        const resultArray = await serializer.deserialize(mixedArray);
        const resultObject = await serializer.deserialize(mixedObject);
        const resultClass = await serializer.deserialize(serializedDataClass);
        const resultDate = await serializer.deserialize(serializedFixedDate);
        const resultMap = await serializer.deserialize(serializedMixedMap);
        const resultSet = await serializer.deserialize(serializedMixedSet);
        const resultView = await serializer.deserialize(serializedViewInt8);
        const resultString = await serializer.deserialize(stringValue);

        expect(resultArray).toStrictEqual(mixedArray);
        expect(resultObject).toStrictEqual(mixedObject);
        expect(resultClass).toStrictEqual(dataClass);
        expect(resultDate).toStrictEqual(fixedDate);
        expect(resultMap).toStrictEqual(mixedMap);
        expect(resultSet).toStrictEqual(mixedSet);
        expect(resultView).toStrictEqual(viewInt8);
        expect(resultString).toStrictEqual(stringValue);
    });
});
