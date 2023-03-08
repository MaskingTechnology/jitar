
export default class SegmentModuleNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Segment module could not be loaded from '${filename}'`);
    }
}
