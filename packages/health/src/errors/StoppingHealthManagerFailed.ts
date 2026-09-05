
export default class StoppingHealthManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Stopping health manager failed', { cause });
    }
}
