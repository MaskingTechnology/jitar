
export default class StartingExecutionManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting execution manager failed', { cause });
    }
}
