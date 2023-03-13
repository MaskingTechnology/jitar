
export default class InvalidSegmentFilename extends Error
{
    constructor(filename: string)
    {
        super(`Segment filename '${filename}' is invalid`);
    }
}
