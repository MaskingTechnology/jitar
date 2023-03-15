
import ReflectionField from './ReflectionField.js';

export default class ReflectionDestructuredValue
{
    #fields: ReflectionField[];

    constructor(fields: ReflectionField[])
    {
        this.#fields = fields;
    }

    get fields() { return this.#fields; }
}
