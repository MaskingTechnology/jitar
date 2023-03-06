
export default class InvalidDateString extends Error
{
    constructor(dateString: string)
    {
        super(`Invalid date string: '${dateString}'`);
    }
}
