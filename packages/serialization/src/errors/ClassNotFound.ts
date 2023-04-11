
export default class ClassNotFound extends Error
{
    constructor(name: string)
    {
        super(`The class '${name}' could not be found`);
    }
}
