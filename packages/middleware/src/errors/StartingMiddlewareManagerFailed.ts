
export default class StartingMiddlewareManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting middleware manager failed', { cause });
    }
}
