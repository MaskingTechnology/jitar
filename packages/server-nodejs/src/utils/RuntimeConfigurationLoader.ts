
import { readFileSync } from 'fs';

import RuntimeConfiguration, { runtimeSchema } from '../configuration/RuntimeConfiguration.js';

import DataConverter from './DataConverter.js';

export default class RuntimeConfigurationLoader
{
    static load(filename: string): RuntimeConfiguration
    {
        const plainContents = readFileSync(filename, 'utf-8');
        const parsedContents = JSON.parse(plainContents);

        return DataConverter.convert<RuntimeConfiguration>(runtimeSchema, parsedContents);
    }
}
