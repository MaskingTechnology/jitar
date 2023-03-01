
export default class InvalidClass extends Error
{
    constructor(name: string)
    {
        super(`The class '${name}' is invalid`);
    }
}
