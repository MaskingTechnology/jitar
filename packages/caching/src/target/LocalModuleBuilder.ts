
import type { Module, Segmentation, Segment } from '../source';

import ImportRewriter from './ImportRewriter';

export default class LocalModuleBuilder
{
    build(module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        const importRewriter = new ImportRewriter(module, segmentation, segment);

        return importRewriter.rewrite();
    }
}
