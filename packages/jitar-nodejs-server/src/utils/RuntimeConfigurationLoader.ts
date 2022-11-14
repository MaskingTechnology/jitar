
import { readFileSync } from 'fs';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.js';

import DataConverter from './DataConverter.js';

export default class RuntimeConfigurationLoader
{
    static async load(filename: string): Promise<RuntimeConfiguration>
    {
        const plainContents = readFileSync(filename, 'utf-8');
        const parsedContents = JSON.parse(plainContents);

        const configuration = await DataConverter.convert<RuntimeConfiguration>(RuntimeConfiguration, parsedContents);

        return configuration;
    }
}
