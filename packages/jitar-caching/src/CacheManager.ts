
import { FileManager } from 'jitar-runtime';
import ApplicationCacheBuilder from './ApplicationCacheBuilder';
import ApplicationCacheWriter from './ApplicationCacheWriter';

import ApplicationReader from './ApplicationReader.js';

export default class CacheManager
{
    #fileManager: FileManager;

    #reader: ApplicationReader;
    #builder: ApplicationCacheBuilder;
    #writer: ApplicationCacheWriter;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;

        this.#reader = new ApplicationReader(fileManager);
        this.#builder = new ApplicationCacheBuilder();
        this.#writer = new ApplicationCacheWriter(fileManager);
    }

    async build(): Promise<void>
    {
        const segmentFiles = await this.#fileManager.filter('**/*.segment.json');
        const moduleFiles = await this.#fileManager.filter('**/*.js');

        const application = await this.#reader.read(segmentFiles, moduleFiles);
        const cache = this.#builder.build(application);

        return this.#writer.write(cache);
    }
}
