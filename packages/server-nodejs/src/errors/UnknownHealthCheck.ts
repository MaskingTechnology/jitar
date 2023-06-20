
export default class UnknownHealthCheck extends Error
{
    constructor(name: string)
    {
        super(`Health check '${name}' is not registered.`);
    }
}
