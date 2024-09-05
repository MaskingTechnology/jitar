
import type { Module } from '../source';
import { FileHelper } from '../utils';

export default class ClassAnnotator
{
    #module: Module;

    constructor(module: Module)
    {
        this.#module = module;
    }

    annotate(): string
    {
        const filename = FileHelper.addSubExtension(this.#module.filename, 'shared');
        const classes = this.#module.reflection.exportedClasses;
        const classNames = classes.map(clazz => clazz.name);
        const sourceCode = classNames.map(className => `${className}.fqn = "/${filename}";`);

        return sourceCode.join('\n');
    }
}
