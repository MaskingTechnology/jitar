
export default class SegmentFileNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Failed to load segment file '${filename}'`);
    }
}
