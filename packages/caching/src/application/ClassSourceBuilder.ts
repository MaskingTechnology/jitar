
import { Module } from '../module';

export default class ClassSourceBuilder
{
    #module: Module;

    constructor(module: Module)
    {
        this.#module = module;
    }

    build(): string
    {
        const filename = this.#module.filename;
        const classes = this.#module.reflection.exportedClasses;
        const classNames = classes.map(clazz => clazz.name);
        const sourceCode = classNames.map(className => `${className}.source = "/${filename}";`);

        return sourceCode.join('\n');
    }
}
