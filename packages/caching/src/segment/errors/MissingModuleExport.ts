
export default class MissingModuleExport extends Error
{
    constructor(filename: string, key: string)
    {
        super(`Module '${filename}' does not export '${key}'`);
    }
}
