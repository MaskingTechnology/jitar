
import ReflectionField from './ReflectionField.js';

export default class ReflectionDestructuredValue
{
    #fields: ReflectionField[];

    constructor(fields: ReflectionField[])
    {
        this.#fields = fields;
    }

    get fields() { return this.#fields; }

    toString(): string
    {
        return this.#fields.map(field => field.toString()).join(' , ');
    }
}
