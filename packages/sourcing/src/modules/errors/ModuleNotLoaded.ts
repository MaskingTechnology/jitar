
export default class ModuleNotLoaded extends Error
{
    constructor(url: string, cause: unknown)
    {
        super(`Module could not be loaded from '${url}'`, { cause });
    }
}
