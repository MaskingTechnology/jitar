
import { FileManager, Files } from '@jitar/runtime';

import ApplicationCacheBuilder from './building/ApplicationCacheBuilder.js';
import ApplicationCacheWriter from './building/ApplicationCacheWriter.js';
import ApplicationReader from './building/ApplicationReader.js';

export default class CacheManager
{
    #projectFileManager: FileManager;
    #appFileManager: FileManager;

    #reader: ApplicationReader;
    #builder: ApplicationCacheBuilder;
    #writer: ApplicationCacheWriter;

    constructor(projectFileManager: FileManager, appFileManager: FileManager)
    {
        this.#projectFileManager = projectFileManager;
        this.#appFileManager = appFileManager;

        this.#reader = new ApplicationReader(appFileManager);
        this.#builder = new ApplicationCacheBuilder();
        this.#writer = new ApplicationCacheWriter(appFileManager);
    }

    async build(): Promise<void>
    {
        const segmentFiles = await this.#projectFileManager.filter(Files.SEGMENT_PATTERN);
        const moduleFiles = await this.#appFileManager.filter(Files.MODULE_PATTERN);

        const application = await this.#reader.read(segmentFiles, moduleFiles);
        const cache = this.#builder.build(application);

        return this.#writer.write(cache);
    }
}
