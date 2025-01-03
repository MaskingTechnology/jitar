
const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const EXPORT_PATTERN = /export\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;

type replaceFunction = (statement: string) => string;

export default class LocationReplacer
{
    replaceImports(code: string, replacer: replaceFunction): string
    {
        return code.replaceAll(IMPORT_PATTERN, replacer);
    }

    replaceExports(code: string, replacer: replaceFunction): string
    {
        return code.replaceAll(EXPORT_PATTERN, replacer);
    }
}
