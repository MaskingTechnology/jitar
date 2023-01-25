
import Component from '../types/Component.js';

export default class PaymentRequired extends Error
{
    constructor(message = 'Payment required')
    {
        super(message);
    }
}

(PaymentRequired as Component).source = '/jitar/core/errors/PaymentRequired.js';
