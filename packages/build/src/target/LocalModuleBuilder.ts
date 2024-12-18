
import { Module, Segmentation, Segment, ResourceList } from '../source';

import ImportRewriter from './ImportRewriter';
import ExportRewriter from './ExportRewriter';

export default class LocalModuleBuilder
{
    build(resources: ResourceList, module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        const importRewriter = new ImportRewriter(resources, module, segmentation, segment);
        const exportRewriter = new ExportRewriter(module, segmentation, segment);

        const importCode = importRewriter.rewrite(module.code);

        return exportRewriter.rewrite(importCode);
    }
}
