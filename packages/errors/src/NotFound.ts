
export default class NotFound extends Error
{
    constructor(message = 'Not found')
    {
        super(message);
    }
}
