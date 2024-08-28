
export default class ModuleNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Segment module could not be loaded from '${filename}'`);
    }
}
