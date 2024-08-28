
export default class PaymentRequired extends Error
{
    constructor(message = 'Payment required')
    {
        super(message);
    }
}
