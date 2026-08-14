
export default class StartingHealthManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting health manager failed', { cause });
    }
}
