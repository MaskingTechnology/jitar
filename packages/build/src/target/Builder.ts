
import { Logger } from '@jitar/logging';

import type { Application } from '../source';

import type ProjectFileManager from '../ProjectFileManager';
import ModuleBuilder from './ModuleBuilder';
import SegmentBuilder from './SegmentBuilder';

export default class Builder
{
    readonly #moduleBuilder: ModuleBuilder;
    readonly #segmentBuilder: SegmentBuilder;

    constructor(projectFileManager: ProjectFileManager, logger: Logger)
    {
        const targetFileManager = projectFileManager.target;

        this.#moduleBuilder = new ModuleBuilder(targetFileManager);
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
