
import type { FileManager } from '@jitar/sourcing';

import { Module, Segmentation, Segment } from '../source';

import ImportRewriter from './ImportRewriter';
import ExportRewriter from './ExportRewriter';

export default class LocalModuleBuilder
{
    build(fileManager: FileManager, module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        const importRewriter = new ImportRewriter(fileManager, module, segmentation, segment);
        const exportRewriter = new ExportRewriter(fileManager, module, segmentation, segment);

        const importCode = importRewriter.rewrite(module.code);

        return exportRewriter.rewrite(importCode);
    }
}
