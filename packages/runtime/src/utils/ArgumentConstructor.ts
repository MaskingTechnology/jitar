
import UnknownParameter from '../errors/UnknownParameter.js';
import MissingParameterValue from '../errors/MissingParameterValue.js';
import InvalidParameterValue from '../errors/InvalidParameterValue.js';

import ArrayParameter from '../models/ArrayParameter.js';
import DestructuredParameter from '../models/DestructuredParameter.js';
import NamedParameter from '../models/NamedParameter.js';
import ObjectParameter from '../models/ObjectParameter.js';
import Parameter from '../models/Parameter.js';

const OPTIONAL_PARAMETER_PREFIX = '*';
const OPTIONAL_PARAMETER_PREFIX_LENGTH = OPTIONAL_PARAMETER_PREFIX.length;

export default class ArgumentExtractor
{
    extract(parameters: Parameter[], args: Map<string, unknown>): unknown[]
    {
        const argsCopy = this.#copyArguments(parameters, args);
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

    #copyArguments(parameters: Parameter[], args: Map<string, unknown>): Map<string, unknown>
    {
        const copy = new Map<string, unknown>();

        for (const [key, value] of args)
        {
            if (this.#isOptionalParameter(key))
            {
                const name = this.#getOptionalParameterName(key);

                if (parameters.find(parameter => parameter.name === name) !== undefined)
                {
                    copy.set(name, value);
                }

                continue;
            }

            copy.set(key, value);
        }

        return copy;
    }

    #isOptionalParameter(name: string): boolean
    {
        return name.startsWith(OPTIONAL_PARAMETER_PREFIX);
    }

    #getOptionalParameterName(name: string): string
    {
        return name.substring(OPTIONAL_PARAMETER_PREFIX_LENGTH);
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

    #extractArrayArgumentValue(parameter: ArrayParameter, args: Map<string, unknown>): unknown[] | undefined
    {
        const values = this.#extractVariableValues(parameter, args);

        return values !== undefined ? Object.values(values) : undefined;
    }

    #extractObjectArgumentValue(parameter: ObjectParameter, args: Map<string, unknown>): Record<string, unknown> | undefined
    {
        return this.#extractVariableValues(parameter, args);
    }

    #extractVariableValues(parameter: DestructuredParameter, args: Map<string, unknown>): Record<string, unknown> | undefined
    {
        const useIndex = parameter instanceof ArrayParameter;
        const values: Record<string, unknown> = {};
        const missingValues: string[] = [];

        let containsValues = false;
        let index = 0;

        for (const variable of parameter.variables)
        {
            const key = useIndex ? index++ : variable.name;
            const value = this.#extractArgumentValue(variable, args, parameter);

            if (value !== undefined)
            {
                containsValues = true;
            }
            else if (variable.isOptional === false)
            {
                missingValues.push(variable.name);
            }

            values[key] = value;
        }

        if (containsValues === true && missingValues.length > 0)
        {
            throw new MissingParameterValue(missingValues[0]);
        }

        return containsValues ? values : undefined;
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
