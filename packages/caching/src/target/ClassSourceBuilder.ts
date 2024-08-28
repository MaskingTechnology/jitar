
import type { Module } from '../source';
import { FileHelper } from '../utils';

export default class ClassSourceBuilder
{
    #module: Module;

    constructor(module: Module)
    {
        this.#module = module;
    }

    build(): string
    {
        const filename = FileHelper.addSubExtension(this.#module.filename, 'shared');
        const classes = this.#module.reflection.exportedClasses;
        const classNames = classes.map(clazz => clazz.name);
        const sourceCode = classNames.map(className => `${className}.source = "/${filename}";`);

        return sourceCode.join('\n');
    }
}
