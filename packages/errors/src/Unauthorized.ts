
export default class Unauthorized extends Error
{
    constructor(message = 'Unauthorized')
    {
        super(message);
    }
}
