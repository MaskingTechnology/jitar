
export default class ReadingResourcesFailed extends Error
{
    constructor(filename: string, cause: unknown)
    {
        super(`Failed reading resources from '${filename}'`, { cause });
    }
}
