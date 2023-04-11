
import { Loadable } from 'jitar-serialization';

export default class PaymentRequired extends Error
{
    constructor(message = 'Payment required')
    {
        super(message);
    }
}

(PaymentRequired as Loadable).source = '/jitar-runtime/errors/generic/PaymentRequired.js';
