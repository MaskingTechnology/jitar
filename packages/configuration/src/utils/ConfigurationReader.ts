
import type { FileManager } from '@jitar/sourcing';

import InvalidFileType from './errors/InvalidConfigurationFile';

const ENVIRONMENT_VARIABLE_REGEX = /\${([^}]*)}/g;

export default class ConfigurationReader
{
    readonly #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async read(filename: string): Promise<Record<string, unknown>>
    {
        const fileExists = await this.#fileManager.exists(filename);

        if (fileExists === false)
        {
            return {};
        }

        const file = await this.#fileManager.read(filename);

        if (file.type.includes('json') === false)
        {
            throw new InvalidFileType(filename);
        }

        const content = file.content.toString();
        const configuration = this.#replaceEnvironmentVariables(content);

        return this.#parseJson(configuration);
    }

    #replaceEnvironmentVariables(content: string): string
    {
        return content.replace(ENVIRONMENT_VARIABLE_REGEX, (match, key) => 
        {
            return process.env[key] ?? 'null';
        });
    }

    #parseJson(configuration: string): Record<string, unknown>
    {
        return JSON.parse(configuration);
    }
}
