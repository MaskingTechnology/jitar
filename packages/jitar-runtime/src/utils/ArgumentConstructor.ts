
import UnknownParameter from '../errors/UnknownParameter.js';
import MissingParameterValue from '../errors/MissingParameterValue.js';

import ArrayParameter from '../models/ArrayParameter.js';
import DestructuredParameter from '../models/DestructuredParameter.js';
import NamedParameter from '../models/NamedParameter.js';
import ObjectParameter from '../models/ObjectParameter.js';
import Parameter from '../interfaces/Parameter.js';
import InvalidParameterValue from '../errors/InvalidParameterValue.js';

export default class ArgumentExtractor
{
    extract(parameters: Parameter[], args: Map<string, unknown>): unknown[]
    {
        const argsCopy = new Map(args);
        const values: unknown[] = [];

        for (const parameter of parameters)
        {
            const value = this.#extractArgumentValue(parameter, argsCopy);
            
            values.push(value);
        }

        if (argsCopy.size > 0)
        {
            const name = argsCopy.keys().next().value;

            throw new UnknownParameter(name);
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
        const value = args.get(parameter.name);

        if (value === undefined && parameter.isOptional === false)
        {
            throw new MissingParameterValue(parameter.name);
        }
        else if (parameter.name.startsWith('...') && value instanceof Array === false)
        {
            throw new InvalidParameterValue(parameter.name);
        }

        args.delete(parameter.name);

        return value;
    }

    #extractDestructedArgumentValue(parameter: DestructuredParameter, args: Map<string, unknown>): unknown
    {
        return parameter instanceof ArrayParameter
            ? this.#extractArrayArgumentValue(parameter, args)
            : this.#extractObjectArgumentValue(parameter, args);
    }

    #extractArrayArgumentValue(parameter: ArrayParameter, args: Map<string, unknown>): unknown[]
    {
        const values: unknown[] = [];

        for (const variable of parameter.variables)
        {
            const value = this.#extractArgumentValue(variable, args);
            
            values.push(value);
        }

        return values;
    }

    #extractObjectArgumentValue(parameter: ObjectParameter, args: Map<string, unknown>): Record<string, unknown>
    {
        const values: Record<string, unknown> = {};

        for (const variable of parameter.variables)
        {
            if (variable instanceof NamedParameter === false)
            {
                throw new InvalidParameterValue('unknown'); // TODO: Add a proper error message
            }
            
            const key = (variable as NamedParameter).name;
            const value = this.#extractArgumentValue(variable, args);
            
            values[key] = value;
        }

        return values;
    }
}
