
export default class UnexpectedParseResult extends Error
{
    constructor(expected: string)
    {
        super(`The given code does not contain ${expected}`);
    }
}
