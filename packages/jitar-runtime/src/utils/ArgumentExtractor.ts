
import UnknownParameter from '../errors/UnknownParameter.js';
import InvalidParameterValue from '../errors/InvalidParameterValue.js';
import MissingParameterValue from '../errors/MissingParameterValue.js';

import ArrayParameter from '../models/ArrayParameter.js';
import DestructuredParameter from '../models/DestructuredParameter.js';
import NamedParameter from '../models/NamedParameter.js';
import ObjectParameter from '../models/ObjectParameter.js';
import Parameter from '../models/Parameter.js';

export default class ArgumentExtractor
{
    extract(parameters: Parameter[], args: Map<string, unknown>): unknown[]
    {
        const incomingKeys = Array.from(args.keys());
        const knownKeys = parameters.map(parameter => parameter.key);
        const additionalKeys = incomingKeys.filter(key => knownKeys.includes(key) === false);
        
        if(additionalKeys.length !== 0)
        {
            throw new UnknownParameter(additionalKeys[0]);
        }

        const values: unknown[] = [];

        for (const parameter of parameters)
        {
            const value = this.#extractArgumentValue(parameter, args);
            
            if (value !== undefined)
            {
                values.push(value);
            }
        }

        return values;
    }

    #extractArgumentValue(parameter: Parameter, args: Map<string, unknown>): unknown
    {
        return parameter instanceof NamedParameter
                ? this.#extractNamedArgumentValue(parameter as NamedParameter, args)
                : this.#extractDestructedArgumentValue(parameter as DestructuredParameter, args);
    }

    #extractNamedArgumentValue(parameter: NamedParameter, args: Map<string, unknown>): unknown
    {
        const value = args.get(parameter.key);

        if (value === undefined && parameter.isOptional === false)
        {
            throw new MissingParameterValue(parameter.key);
        }

        return value;
    }

    #extractDestructedArgumentValue(parameter: DestructuredParameter, args: Map<string, unknown>): unknown
    {
        const value = args.get(parameter.key);

        if (value === undefined)
        {
            throw new MissingParameterValue(parameter.key);
        }
        else if (value instanceof Map === false)
        {
            throw new InvalidParameterValue(parameter.key);
        }

        return parameter instanceof ArrayParameter
            ? this.#extractArrayArgumentValue(parameter, value as Map<string, unknown>)
            : this.#extractObjectArgumentValue(parameter, value as Map<string, unknown>);
    }

    #extractArrayArgumentValue(parameter: ArrayParameter, args: Map<string, unknown>): unknown[]
    {
        const values: unknown[] = [];

        for (const variable of parameter.variables)
        {
            const value = this.#extractArgumentValue(variable, args);
            
            if (value !== undefined)
            {
                values.push(value);
            }
        }

        return values;
    }

    #extractObjectArgumentValue(parameter: ObjectParameter, args: Map<string, unknown>): object
    {
        const values: Record<string, unknown> = {};

        for (const variable of parameter.variables)
        {
            const value = this.#extractArgumentValue(variable, args);
            
            if (value !== undefined)
            {
                values[variable.key] = value;
            }
        }

        return values;
    }
}
