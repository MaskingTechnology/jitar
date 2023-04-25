
export default class UnexpectedToken extends Error
{
    constructor(value: string, position: number)
    {
        super(`Unexpected token '${value}' at position ${position}`);
    }
}
