
import MissingParameterValue from './errors/MissingParameterValue.js';
import UnknownParameter from './errors/UnknownParameter.js'
import ReflectionParameter from './reflection/models/ReflectionParameter.js';
import * as AccessLevel from './definitions/AccessLevel.js';
import Version from './Version.js';
import Context from './Context.js';

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

    async run(args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const context = this.#createContext(headers);
        const values = this.#extractParameterValues(args);

        return await this.#executable.call(context, ...values);
    }

    #createContext(headers: Map<string, string>)
    {
        return new Context(headers);
    }

    #extractParameterValues(parameters: Map<string, unknown>): unknown[]
    {
        const values: unknown[] = [];

        const incommingKeys = Array.from(parameters.keys());
        const knownKeys = this.#parameters.map(parameter => parameter.name);
        const additionalKeys = incommingKeys.filter(key => knownKeys.includes(key) === false);
        
        if(additionalKeys.length !== 0)
        {
            throw new UnknownParameter(additionalKeys[0]);
        }

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
