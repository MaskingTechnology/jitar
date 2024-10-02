
import ValueSerializer from '../ValueSerializer';
import SerializedDate from '../types/serialized/SerializedDate';
import InvalidDateString from './errors/InvalidDateString';

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

    async deserialize(object: SerializedDate): Promise<Date>
    {
        const date = new Date(object.value);
        
        if (date.toString() === 'Invalid Date')
        {
            throw new InvalidDateString(object.value);
        }

        return date;
    }
}
