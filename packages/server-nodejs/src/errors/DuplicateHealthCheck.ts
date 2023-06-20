
export default class DuplicateHealthCheck extends Error
{
    constructor(name: string)
    {
        super(`Health check '${name}' is already registered.`);
    }
}
