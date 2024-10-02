
export default class BadRequest extends Error
{
    constructor(message = 'Invalid request')
    {
        super(message);
    }
}
