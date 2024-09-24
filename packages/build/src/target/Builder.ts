
import type { FileManager } from '@jitar/sourcing';

import type { Application } from '../source';

import ModuleBuilder from './ModuleBuilder';
import SegmentBuilder from './SegmentBuilder';

export default class Builder
{
    #moduleBuilder: ModuleBuilder;
    #segmentBuilder: SegmentBuilder;

    constructor(fileManager: FileManager)
    {
        this.#moduleBuilder = new ModuleBuilder(fileManager);
        this.#segmentBuilder = new SegmentBuilder(fileManager);
    }

    async build(application: Application): Promise<void>
    {
        await Promise.all([
            this.#moduleBuilder.build(application),
            this.#segmentBuilder.build(application)
        ]);
    }
}