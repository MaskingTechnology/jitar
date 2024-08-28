
import { type FileManager, FileManagerBuilder } from '@jitar/sourcing';

import Configuration from './models/Configuration';

const DEFAULT_CONFIGURATION_FILENAME = 'jitar.json';

export default class ConfigurationManager
{
    #fileManager: FileManager;

    constructor()
    {
        this.#fileManager = new FileManagerBuilder('./').buildLocal();
    }

    async configure(filename = DEFAULT_CONFIGURATION_FILENAME): Promise<Configuration>
    {
        return await this.#fileManager.exists(filename)
            ? this.#configureFromFile(filename)
            : this.#configureDefault();
    }

    async #configureFromFile(filename: string): Promise<Configuration>
    {
        const file = this.#fileManager.read(filename);

        return new Configuration("source", "target");
    }

    #configureDefault(): Configuration
    {
        return new Configuration('./dist', './dist');
    }
}
