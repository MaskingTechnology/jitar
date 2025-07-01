
export default class CommandNotFound extends Error
{
    constructor(name: string)
    {
        super(`Command ${name} not found`);
    }
}
