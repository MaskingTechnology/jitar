
export default class StartingServerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting server failed', { cause });
    }
}
