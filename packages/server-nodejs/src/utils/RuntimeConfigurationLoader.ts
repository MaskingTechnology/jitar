
import { readFileSync } from 'fs';

import RuntimeConfiguration, { runtimeSchema } from '../configuration/RuntimeConfiguration.js';

import EnvironmentVariableNotFound from '../errors/EnvironmentVariableNotFound.js';

import DataConverter from './DataConverter.js';

const ENVIRONMENT_VARIABLE_REGEX = /\${([^}]*)}/g;

export default class RuntimeConfigurationLoader
{
    static load(filename: string): RuntimeConfiguration
    {
        const plainContents = readFileSync(filename, 'utf-8');
        const replacedContents = this.#replaceEnvironmentVariables(plainContents);
        const parsedContents = JSON.parse(replacedContents);

        return DataConverter.convert<RuntimeConfiguration>(runtimeSchema, parsedContents);
    }

    static #replaceEnvironmentVariables(contents: string): string
    {
        return contents.replace(ENVIRONMENT_VARIABLE_REGEX, (match, group) => 
        {
            const value = process.env[group];
            
            if (value === undefined)
            {
                throw new EnvironmentVariableNotFound(group);
            }

            return value;
        });
    }
}
