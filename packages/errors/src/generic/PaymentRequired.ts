
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class PaymentRequired extends Error
{
    constructor(message = 'Payment required')
    {
        super(message);
    }
}

(PaymentRequired as Loadable).source = createSource(import.meta.url);
