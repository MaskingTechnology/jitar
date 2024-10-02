
export default class ModuleNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Segmented module not found '${filename}'`);
    }
}
