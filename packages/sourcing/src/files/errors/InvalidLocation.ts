
export default class InvalidPath extends Error
{
    constructor(location: string)
    {
        super(`Invalid location '${location}'`);
    }
}
