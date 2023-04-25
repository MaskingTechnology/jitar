
export default class SegmentModuleNotLoaded extends Error
{
    constructor(filename: string, message: string)
    {
        super(`Segment module could not be loaded from '${filename}' because of: ${message}`);
    }
}
