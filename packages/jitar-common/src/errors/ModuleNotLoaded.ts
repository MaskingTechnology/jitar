
export default class ModuleNotLoaded extends Error
{
    constructor(url: string, message?: string)
    {
        super(`Module '${url}' could not be loaded${message !== undefined ? ` | ${message}` : ''}`);
    }
}
