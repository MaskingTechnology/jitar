
export default class InvalidBigIntString extends Error
{
    constructor(bigIntString: string)
    {
        super(`Invalid BigInt string '${bigIntString}'`);
    }
}
