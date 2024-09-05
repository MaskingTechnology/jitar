
import type { Module, Segmentation, Segment } from '../source';

// import ClassAnnotator from './ClassAnnotator';
import ImportRewriter from './ImportRewriter';

export default class LocalModuleBuilder
{
    build(module: Module, segmentation: Segmentation, segment?: Segment): string
    {
        // const classAnnotator = new ClassAnnotator(module);
        const importRewriter = new ImportRewriter(module, segmentation, segment);

        return importRewriter.rewrite();
        // const sourceCode = classAnnotator.annotate();

        // return `${importCode}\n${sourceCode}`;
    }
}
