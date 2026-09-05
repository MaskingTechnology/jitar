
export default class BuildFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Build failed', { cause });
    }
}
