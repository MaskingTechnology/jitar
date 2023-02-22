
import ApplicationModule from './models/ApplicationModule.js';
import * as Keywords from './definitions/Keywords.js';

export default class SourceAppender
{
    static append(module: ApplicationModule, code: string, filename: string): string
    {
        const classNames = this.#extractClassNames(module);

        if (classNames.length === 0)
        {
            return code;
        }

        const sourceCode = this.#createSourceCode(filename, classNames);

        return `${code}\n${sourceCode}`;
    }

    static #extractClassNames(module: ApplicationModule): string[]
    {
        const classes = module.classes;
        const names: string[] = [];

        for (const key of classes.keys())
        {
            const clazz = classes.get(key);

            if (clazz === undefined)
            {
                continue;
            }

            if (key !== Keywords.DEFAULT && key !== clazz.name)
            {
                // The object is being (re) exported under another name.
                // We need to skip this because we can't be sure the real
                // object is present in the module.
                continue;
            }

            names.push(clazz.name);
        }

        return names;
    }

    static #createSourceCode(filename: string, classNames: string[]): string
    {
        const codes = classNames.map(className => `${className}.source = '${filename}';`);

        return codes.join('\n');
    }
}
