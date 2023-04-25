
export default class ExpectedKeyword extends Error
{
    constructor(value: string, position: number)
    {
        super(`Expected keyword '${value}' at position ${position}`);
    }
}
