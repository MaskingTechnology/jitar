
import ValueSerializer from '../ValueSerializer';
import SerializedTemporal from '../types/serialized/SerializedTemporal';
import InvalidTemporalString from './errors/InvalidTemporalString';
import InvalidTemporalType from './errors/InvalidTemporalType';

const TEMPORAL_TYPES = [
    'Instant',
    'ZonedDateTime',
    'PlainDateTime',
    'PlainDate',
    'PlainTime',
    'PlainYearMonth',
    'PlainMonthDay',
    'Duration'
] as const;

type TemporalType = typeof TEMPORAL_TYPES[number];

type TemporalValue = InstanceType<typeof Temporal[TemporalType]>;

export default class TemporalSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return this.#getType(value) !== undefined;
    }

    canDeserialize(value: unknown): boolean
    {
        const temporal = value as SerializedTemporal;

        return temporal instanceof Object
            && temporal.serialized === true
            && temporal.name === 'Temporal'
            && typeof temporal.type === 'string'
            && typeof temporal.value === 'string';
    }

    async serialize(temporal: TemporalValue): Promise<SerializedTemporal>
    {
        const type = this.#getType(temporal) as TemporalType;

        return { serialized: true, name: 'Temporal', type, value: temporal.toString() };
    }

    async deserialize(object: SerializedTemporal): Promise<TemporalValue>
    {
        if (this.#isType(object.type) === false)
        {
            throw new InvalidTemporalType(object.type);
        }

        try
        {
            return Temporal[object.type].from(object.value);
        }
        catch
        {
            throw new InvalidTemporalString(object.type, object.value);
        }
    }

    #getType(value: unknown): TemporalType | undefined
    {
        return TEMPORAL_TYPES.find(type => value instanceof Temporal[type]);
    }

    #isType(type: string): type is TemporalType
    {
        return (TEMPORAL_TYPES as readonly string[]).includes(type);
    }
}
