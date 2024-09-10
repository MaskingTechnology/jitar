
export default class MissingArgument extends Error
{
    constructor(name: string)
    {
        super(`Missing argument '${name}'`);
    }
}
