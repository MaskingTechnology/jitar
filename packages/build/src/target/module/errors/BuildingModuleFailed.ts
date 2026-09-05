
export default class BuildingModuleFailed extends Error
{
    constructor(filename: string, cause: unknown)
    {
        super(`Failed building module for '${filename}'`, { cause });
    }
}
