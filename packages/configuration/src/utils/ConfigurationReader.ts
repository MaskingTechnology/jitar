
import { LocalFileManager } from '@jitar/sourcing';
import type { FileManager } from '@jitar/sourcing';

const ENVIRONMENT_VARIABLE_REGEX = /\${([^}]*)}/g;

export default class ConfigurationReader
{
    readonly #fileManager: FileManager;

    constructor(rootPath: string)
    {
        this.#fileManager = new LocalFileManager(rootPath);
    }

    async read(filename: string): Promise<Record<string, unknown>>
    {
        const fileExists = await this.#fileManager.exists(filename);

        if (fileExists === false)
        {
            return {};
        }

        const file = await this.#fileManager.read(filename);
        const content = file.content.toString();
        const configuration = this.#replaceEnvironmentVariables(content);
        
        return file.type.includes('json')
            ? this.#parseJson(configuration)
            : this.#parseText(configuration);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #parseText(configuration: string): Record<string, unknown>
    {
        return {};
    }
}
