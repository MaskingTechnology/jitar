
import MissingParameterValue from './errors/MissingParameterValue.js';
import ReflectionParameter from './reflection/models/ReflectionParameter.js';
import * as AccessLevel from './definitions/AccessLevel.js';
import Version from './Version.js';

export default class Implementation
{
    #version: Version;
    #access: string;
    #parameters: ReflectionParameter[];
    #executable: Function;

    constructor(version: Version, access: string, parameters: ReflectionParameter[], executable: Function)
    {
        this.#version = version;
        this.#access = access;
        this.#parameters = parameters;
        this.#executable = executable;
    }

    get version() { return this.#version; }

    get public() { return this.#access === AccessLevel.PUBLIC; }

    get parameters() { return this.#parameters; }

    async run(args: Map<string, unknown>): Promise<unknown>
    {
        const values = this.#extractParameterValues(args);

        return await this.#executable.call(this.#executable, ...values);
    }

    #extractParameterValues(parameters: Map<string, unknown>): unknown[]
    {
        const values: unknown[] = [];

        for (const parameter of this.#parameters)
        {
            const value = parameters.get(parameter.name);

            if (value === undefined && parameter.isOptional === false)
            {
                throw new MissingParameterValue(parameter.name);
            }

            values.push(value);
        }

        return values;
    }
}
