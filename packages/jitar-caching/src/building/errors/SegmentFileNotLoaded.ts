
export default class SegmentFileNotLoaded extends Error
{
    constructor(filename: string, message: string)
    {
        super(`Failed to load segment file '${filename}' because of: ${message}`);
    }
}
