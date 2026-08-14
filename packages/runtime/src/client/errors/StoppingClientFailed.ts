
export default class StoppingClientFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Stopping client failed', { cause });
    }
}
