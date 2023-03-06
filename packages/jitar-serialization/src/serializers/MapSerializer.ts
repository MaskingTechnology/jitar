
import ValueSerializer from '../ValueSerializer.js';
import SerializedMap from '../types/serialized/SerializedMap.js';

export default class MapSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Map;
    }

    canDeserialize(value: unknown): boolean
    {
        const map = value as SerializedMap;

        return map instanceof Object
            && map.serialized === true
            && map.name === 'Map'
            && map.entries instanceof Object
            && map.entries.keys instanceof Array
            && map.entries.values instanceof Array;
    }
    
    async serialize(map: Map<unknown, unknown>): Promise<SerializedMap>
    {
        const keys: unknown[] = [];
        const values: unknown[] = [];

        for (const [key, value] of map)
        {
            keys.push(await this.serializeOther(key));
            values.push(await this.serializeOther(value));
        }

        return { serialized: true, name: 'Map', entries: { keys: keys, values: values } };
    }

    async deserialize(object: SerializedMap): Promise<Map<unknown, unknown>>
    {
        const keys = object.entries.keys;
        const values = object.entries.values;

        const result = new Map();

        for (let index = 0; index < keys.length; index++)
        {
            const key = await this.deserializeOther(keys[index]);
            const value = await this.deserializeOther(values[index]);

            result.set(key, value);
        }

        return result;
    }
}
