
import Serializer from './interfaces/Serializer.js';

import SerializedDate from './types/SerializedDate.js';
import InvalidPropertyType from './errors/InvalidPropertyType.js';

class DateSerializer implements Serializer
{
    serialize(date: Date): SerializedDate
    {
        return { serialized: true, name: 'Date', value: date.toISOString() };
    }

    async deserialize(serializedDate: SerializedDate): Promise<Date>
    {
        this.#validateDate(serializedDate);

        return new Date(serializedDate.value);
    }

    #validateDate(serializedDate: SerializedDate): void
    {
        if (typeof serializedDate.value !== 'string')
        {
            throw new InvalidPropertyType('date', 'value', 'string');
        }

        const date = Date.parse(serializedDate.value);

        if (Number.isNaN(date))
        {
            throw new InvalidPropertyType('date', 'value', 'date');
        }
    }
}

const instance = new DateSerializer();

export default instance;
