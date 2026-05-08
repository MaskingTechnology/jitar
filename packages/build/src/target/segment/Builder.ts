
import { Logger } from '@jitar/logging';
import type { FileManager } from '@jitar/sourcing';

import type { Application, Segment } from '../../source';

import Generator from './Generator';

export default class Builder
{
    readonly #targetFileManager: FileManager;

    readonly #logger: Logger;

    constructor(targetFileManager: FileManager, logger: Logger)
    {
        this.#targetFileManager = targetFileManager;
        this.#logger = logger;
    }

    async build(application: Application): Promise<void>
    {
        const segmentation = application.segmentation;

        const builds = segmentation.segments.map(segment => this.#buildSegment(segment));

        await Promise.all(builds);
    }

    async #buildSegment(segment: Segment): Promise<void>
    {
        const filename = `${segment.name}.segment.js`;

        const generator = new Generator(segment);
        const code = generator.generate();

        await this.#targetFileManager.write(filename, code);

        this.#logger.info(`Built ${segment.name} segment (${segment.modules.length} modules, ${segment.procedures.length} procedures, ${segment.classes.length} classes)`);
    }
}
