
export default class Forbidden extends Error
{
    constructor(message = 'Forbidden')
    {
        super(message);
    }
}
