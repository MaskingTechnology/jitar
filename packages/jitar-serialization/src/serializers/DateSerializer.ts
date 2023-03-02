
import ValueSerializer from '../ValueSerializer.js';
import InvalidPropertyType from '../errors/InvalidPropertyType.js';
import SerializedDate from '../types/serialized/SerializedDate.js';

export default class DateSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Date;
    }

    canDeserialize(value: unknown): boolean
    {
        const date = value as SerializedDate;
        
        return date instanceof Object
            && date.serialized === true
            && date.name === 'Date'
            && typeof date.value === 'string';
    }
    
    async serialize(date: Date): Promise<SerializedDate>
    {
        return { serialized: true, name: 'Date', value: date.toISOString() };
    }

    async deserialize(serializedDate: SerializedDate): Promise<Date>
    {
        const date = new Date(serializedDate.value);

        if (Number.isNaN(date))
        {
            throw new InvalidPropertyType('date', 'value', 'date');
        }

        return date;
    }
}
