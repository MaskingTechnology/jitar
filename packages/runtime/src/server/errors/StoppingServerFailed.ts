
export default class StoppingServerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Stopping server failed', { cause });
    }
}
