
export default class ModuleNotFound extends Error
{
    constructor(filename: string)
    {
        super(`Segmented module not found '${filename}'`);
    }
}
