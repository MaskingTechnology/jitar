
export default class InvalidBigIntString extends Error
{
    constructor(bigIntString: string)
    {
        super(`Invalid bigInt string '${bigIntString}'`);
    }
}
