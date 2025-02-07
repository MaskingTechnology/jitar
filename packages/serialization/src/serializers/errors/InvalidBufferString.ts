
export default class InvalidBufferString extends Error
{
    constructor(bufferString: string)
    {
        super(`Invalid Buffer string '${bufferString}'`);
    }
}
