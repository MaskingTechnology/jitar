
import { describe, expect, it } from 'vitest';

import SerializerBuilder from '../src/SerializerBuilder';

import { ARRAYS, OBJECTS, CLASSES, DATES, MAPS, SETS, TYPED_ARRAYS, PRIMITIVES, classResolver } from './serializers/fixtures';

const serializer = SerializerBuilder.build(classResolver);

describe('SerializerBuilder', () =>
{
    it('should serialize mixed types with the build serializer', async () =>
    {
        const resultArray = await serializer.serialize(ARRAYS.MIXED);
        const resultObject = await serializer.serialize(OBJECTS.MIXED);
        const resultClass = await serializer.serialize(CLASSES.DATA_INSTANCE);
        const resultDate = await serializer.serialize(DATES.FIXED);
        const resultMap = await serializer.serialize(MAPS.MIXED);
        const resultSet = await serializer.serialize(SETS.MIXED);
        const resultView = await serializer.serialize(TYPED_ARRAYS.INT8);
        const resultString = await serializer.serialize(PRIMITIVES.STRING);

        expect(resultArray).toStrictEqual(ARRAYS.MIXED);
        expect(resultObject).toStrictEqual(OBJECTS.MIXED);
        expect(resultClass).toStrictEqual(CLASSES.DATA_SERIALIZED);
        expect(resultDate).toStrictEqual(DATES.FIXED_SERIALIZED);
        expect(resultMap).toStrictEqual(MAPS.MIXED_SERIALIZED);
        expect(resultSet).toStrictEqual(SETS.MIXED_SERIALIZED);
        expect(resultView).toStrictEqual(TYPED_ARRAYS.INT8_SERIALIZED);
        expect(resultString).toStrictEqual(PRIMITIVES.STRING);
    });

    it('should deserialize mixed types with the build serializer', async () =>
    {
        const resultArray = await serializer.deserialize(ARRAYS.MIXED);
        const resultObject = await serializer.deserialize(OBJECTS.MIXED);
        const resultClass = await serializer.deserialize(CLASSES.DATA_SERIALIZED);
        const resultDate = await serializer.deserialize(DATES.FIXED_SERIALIZED);
        const resultMap = await serializer.deserialize(MAPS.MIXED_SERIALIZED);
        const resultSet = await serializer.deserialize(SETS.MIXED_SERIALIZED);
        const resultView = await serializer.deserialize(TYPED_ARRAYS.INT8_SERIALIZED);
        const resultString = await serializer.deserialize(PRIMITIVES.STRING);

        expect(resultArray).toStrictEqual(ARRAYS.MIXED);
        expect(resultObject).toStrictEqual(OBJECTS.MIXED);
        expect(resultClass).toStrictEqual(CLASSES.DATA_INSTANCE);
        expect(resultDate).toStrictEqual(DATES.FIXED);
        expect(resultMap).toStrictEqual(MAPS.MIXED);
        expect(resultSet).toStrictEqual(SETS.MIXED);
        expect(resultView).toStrictEqual(TYPED_ARRAYS.INT8);
        expect(resultString).toStrictEqual(PRIMITIVES.STRING);
    });
});
