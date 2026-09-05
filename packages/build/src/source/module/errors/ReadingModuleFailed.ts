
export default class ReadingModuleFailed extends Error
{
    constructor(filename: string, cause: unknown)
    {
        super(`Failed reading module from '${filename}'`, { cause });
    }
}
