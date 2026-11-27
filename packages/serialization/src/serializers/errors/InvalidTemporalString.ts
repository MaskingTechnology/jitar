
export default class InvalidTemporalString extends Error
{
    constructor(type: string, temporalString: string)
    {
        super(`Invalid temporal ${type} string '${temporalString}'`);
    }
}
