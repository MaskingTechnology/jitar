
export default class ExpectedToken extends Error
{
    constructor(value: string, position: number)
    {
        super(`Expected token '${value}' at position ${position}`);
    }
}
