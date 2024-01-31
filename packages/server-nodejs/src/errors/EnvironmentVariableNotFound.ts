
export default class EnvironmentVariableNotFound extends Error
{
    constructor(name: string)
    {
        super(`The environment variable '${name}' is not found`);
    }
}
