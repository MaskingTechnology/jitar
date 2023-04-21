
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class Unauthorized extends Error
{
    constructor(message = 'Unauthorized')
    {
        super(message);
    }
}

(Unauthorized as Loadable).source = createSource(import.meta.url);
