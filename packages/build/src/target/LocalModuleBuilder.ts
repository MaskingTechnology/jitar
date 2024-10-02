
import { Module, Segmentation, Segment } from '../source';

import ImportRewriter from './ImportRewriter';
import ExportRewriter from './ExportRewriter';

export default class LocalModuleBuilder
{
    build(module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        const importRewriter = new ImportRewriter(module, segmentation, segment);
        const exportRewriter = new ExportRewriter(module, segmentation, segment);

        const importCode = importRewriter.rewrite(module.code);

        return exportRewriter.rewrite(importCode);
    }
}
