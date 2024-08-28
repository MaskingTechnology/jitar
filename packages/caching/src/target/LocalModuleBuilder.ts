
import type { Module, Segmentation, Segment } from '../source';

import ClassSourceBuilder from './ClassSourceBuilder';
import ImportRewriter from './ImportRewriter';

export default class LocalModuleBuilder
{
    build(module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        const classSourceBuilder = new ClassSourceBuilder(module);
        const importRewriter = new ImportRewriter(module, segmentation, segment);

        const importCode = importRewriter.rewrite();
        const sourceCode = classSourceBuilder.build();

        return `${importCode}\n${sourceCode}`;
    }
}
