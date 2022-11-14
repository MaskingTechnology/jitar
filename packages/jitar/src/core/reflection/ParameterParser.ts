
import ReflectionParameter from './models/ReflectionParameter.js';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export default class ParameterParser
{
    static parse(code: string, functionIndicator: string): ReflectionParameter[]
    {
        const pureCode = this.#removeComments(code);
        const parameterString = this.#extractParameterString(pureCode, functionIndicator);
        const parameterList = this.#parseParamaterString(parameterString);

        return parameterList.map(parameter => this.#extractParameter(parameter));
    }

    static #removeComments(code: string): string
    {
        return code.replace(STRIP_COMMENTS, '');
    }

    static #extractParameterString(code: string, functionIndicator: string): string
    {
        const indicatorPosition = code.indexOf(functionIndicator);

        const bodyStart = code.indexOf('{', indicatorPosition);
        const definition = code.substring(indicatorPosition, bodyStart).trim();

        const startPosition = definition.indexOf('(') + 1;
        const endPosition = definition.lastIndexOf(')', startPosition);

        return definition.slice(startPosition, endPosition);
    }

    static #parseParamaterString(parameterString: string): string[]
    {
        const parameters: string[] = [];

        let level = 0;
        let buffer = '';

        for (let character of parameterString)
        {
            switch (character)
            {
                case '(': level++; break;
                case ')': level--; break;
                case ',':
                    if (level === 0)
                    {
                        parameters.push(buffer);
                        character = '';
                        buffer = '';
                    }
            }

            buffer += character;
        }

        if (buffer !== '')
        {
            parameters.push(buffer);
        }

        return parameters;
    }

    static #extractParameter(parameter: string): ReflectionParameter
    {
        const [name, defaultValue] = parameter.split('=').map(part => part.trim());

        return new ReflectionParameter(name, defaultValue);
    }
}
