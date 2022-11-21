
import { readFileSync } from 'https://deno.land/std@0.113.0/node/fs.ts';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.ts';

import DataConverter from './DataConverter.ts';

export default class RuntimeConfigurationLoader
{
    static async load(filename: string): Promise<RuntimeConfiguration>
    {
        const plainContents = readFileSync(filename, 'utf-8');
        const parsedContents = JSON.parse(plainContents);

        console.log('Configuration loaded...', parsedContents);

        const configuration = await DataConverter.convert<RuntimeConfiguration>(RuntimeConfiguration, parsedContents);

        return configuration;
    }
}
