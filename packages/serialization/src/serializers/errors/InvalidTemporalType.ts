
export default class InvalidTemporalType extends Error
{
    constructor(type: string)
    {
        super(`Invalid temporal type '${type}'`);
    }
}
