
export default class ReadingSegmentFailed extends Error
{
    constructor(filename: string, cause: unknown)
    {
        super(`Failed reading segment from '${filename}'`, { cause });
    }
}
