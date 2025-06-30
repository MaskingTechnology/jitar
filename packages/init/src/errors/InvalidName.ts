
export default class InvalidName extends Error
{
    constructor(name: string, type: string)
    {
        super(`Invalid ${type} name: ${name}`);
    }
}
