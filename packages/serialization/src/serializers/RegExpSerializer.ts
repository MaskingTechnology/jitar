
import ValueSerializer from '../ValueSerializer';
import SerializedRegExp from '../types/serialized/SerializedRegExp';
import InvalidRegExp from './errors/InvalidRegExp';

export default class RegExpSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof RegExp;
    }

    canDeserialize(value: unknown): boolean
    {
        const regExp = value as SerializedRegExp;

        return regExp instanceof Object
            && regExp.serialized === true
            && regExp.name === 'RegExp'
            && typeof regExp.source === 'string'
            && typeof regExp.flags === 'string';
    }

    async serialize(regExp: RegExp): Promise<SerializedRegExp>
    {
        return { serialized: true, name: 'RegExp', source: regExp.source, flags: regExp.flags };
    }

    async deserialize(object: SerializedRegExp): Promise<RegExp>
    {
        try
        {
            return new RegExp(object.source, object.flags);
        }
        catch (error)
        {
            throw new InvalidRegExp(object.source, object.flags);
        }
    }
}
