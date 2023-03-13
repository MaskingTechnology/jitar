
export default class ModuleFileNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Failed to load module file '${filename}'`);
    }
}
