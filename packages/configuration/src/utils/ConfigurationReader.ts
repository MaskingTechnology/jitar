
import { type FileManager, FileManagerBuilder } from '@jitar/sourcing';

export default class ConfigurationReader
{
    #fileManager: FileManager;

    constructor(rootPath: string)
    {
        this.#fileManager = new FileManagerBuilder(rootPath).buildLocal();
    }

    async read(filename: string): Promise<Record<string, unknown>>
    {
        const fileExists = await this.#fileManager.exists(filename);

        if (fileExists === false)
        {
            return {};
        }

        const file = await this.#fileManager.read(filename);

        const isJsonFile  = file.type.includes('json');

        if (isJsonFile === false)
        {
            return {};
        }

        const content = file.content.toString();

        return JSON.parse(content);
    }
}
