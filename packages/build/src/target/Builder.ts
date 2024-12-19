
import { Logger } from '@jitar/logging';
import type { FileManager } from '@jitar/sourcing';

import type { Application } from '../source';

import ModuleBuilder from './ModuleBuilder';
import SegmentBuilder from './SegmentBuilder';

export default class Builder
{
    readonly #moduleBuilder: ModuleBuilder;
    readonly #segmentBuilder: SegmentBuilder;

    constructor(sourceFileManager: FileManager, targetFileManager: FileManager, logger: Logger)
    {
        this.#moduleBuilder = new ModuleBuilder(sourceFileManager, targetFileManager);
        this.#segmentBuilder = new SegmentBuilder(targetFileManager, logger);
    }

    async build(application: Application): Promise<void>
    {
        await Promise.all([
            this.#moduleBuilder.build(application),
            this.#segmentBuilder.build(application)
        ]);
    }
}
