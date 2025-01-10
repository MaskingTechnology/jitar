
import { Module, Segmentation, Segment, ResourcesList } from '../../source';

import ImportRewriter from './ImportRewriter';
import ExportRewriter from './ExportRewriter';

export default class LocalBuilder
{
    build(module: Module, resources: ResourcesList, segmentation: Segmentation, segment?: Segment): string
    {
        const importRewriter = new ImportRewriter(module, resources, segmentation, segment);
        const exportRewriter = new ExportRewriter(module, resources, segmentation, segment);

        const importCode = importRewriter.rewrite(module.code);

        return exportRewriter.rewrite(importCode);
    }
}
