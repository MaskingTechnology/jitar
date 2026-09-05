
export default class StartingClientFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting client failed', { cause });
    }
}
