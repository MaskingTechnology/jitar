
import UnknownParameter from '../errors/UnknownParameter.js';
import MissingParameterValue from '../errors/MissingParameterValue.js';

import ArrayParameter from '../models/ArrayParameter.js';
import DestructuredParameter from '../models/DestructuredParameter.js';
import NamedParameter from '../models/NamedParameter.js';
import ObjectParameter from '../models/ObjectParameter.js';
import Parameter from '../models/Parameter.js';
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

    #extractArgumentValue(parameter: Parameter, args: Map<string, unknown>, parent?: Parameter): unknown
    {
        return parameter instanceof NamedParameter
                ? this.#extractNamedArgumentValue(parameter as NamedParameter, args, parent)
                : this.#extractDestructedArgumentValue(parameter as DestructuredParameter, args);
    }

    #extractNamedArgumentValue(parameter: NamedParameter, args: Map<string, unknown>, parent?: Parameter): unknown
    {
        const value = args.get(parameter.name);

        if (this.#isMissingParameterValue(parameter, value, parent))
        {
            throw new MissingParameterValue(parameter.name);
        }
        else if (this.#isInvalidRestParameter(parameter, value, parent))
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
            const value = this.#extractArgumentValue(variable, args, parameter);
            
            values[variable.name] = value;
        }

        return values;
    }

    #isMissingParameterValue(parameter: Parameter, value: unknown, parent?: Parameter): boolean
    {
        if (value !== undefined)
        {
            return false;
        }

        return parameter.isOptional !== true
            && parent?.isOptional !== true;
    }

    #isInvalidRestParameter(parameter: Parameter, value: unknown, parent?: Parameter): boolean
    {
        if (parameter.name.startsWith('...') === false)
        {
            return false;
        }

        return (parent === undefined && value instanceof Array === false)
            || (parent instanceof ArrayParameter && value instanceof Array === false)
            || (parent instanceof ObjectParameter && value instanceof Object === false);
    }
}
