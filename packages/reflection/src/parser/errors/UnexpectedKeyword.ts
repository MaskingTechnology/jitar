
export default class UnexpectedKeyword extends Error
{
    constructor(keyword: string, position: number)
    {
        super(`Unexpected keyword '${keyword}' at position ${position}`);
    }
}
