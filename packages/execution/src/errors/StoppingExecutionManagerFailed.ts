
export default class StoppingExecutionManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Stopping execution manager failed', { cause });
    }
}
