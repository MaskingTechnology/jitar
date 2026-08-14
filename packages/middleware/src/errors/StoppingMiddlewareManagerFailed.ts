
export default class StoppingMiddlewareManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Stopping middleware manager failed', { cause });
    }
}
