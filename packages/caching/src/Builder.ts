
import { FileManager, Files } from '@jitar/runtime';

import { ApplicationReader, ApplicationBuilder } from './application';

export default class Builder
{
    #projectFileManager: FileManager;
    #appFileManager: FileManager;

    #applicationReader: ApplicationReader;
    #applicationBuilder: ApplicationBuilder;

    constructor(projectFileManager: FileManager, appFileManager: FileManager)
    {
        this.#projectFileManager = projectFileManager;
        this.#appFileManager = appFileManager;

        this.#applicationReader = new ApplicationReader(appFileManager);
        this.#applicationBuilder = new ApplicationBuilder(appFileManager);
    }

    async build(): Promise<void>
    {
        const moduleFiles = await this.#appFileManager.filter(Files.MODULE_PATTERN);
        const segmentFiles = await this.#projectFileManager.filter(Files.SEGMENT_PATTERN);

        const application = await this.#applicationReader.read(moduleFiles, segmentFiles);

        return this.#applicationBuilder.build(application);
    }
}
