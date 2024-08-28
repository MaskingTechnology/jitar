
export default class InvalidFilename extends Error
{
    constructor(filename: string)
    {
        super(`Segment filename '${filename}' is invalid`);
    }
}
