
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class BadRequest extends Error
{
    constructor(message = 'Invalid request')
    {
        super(message);
    }
}

(BadRequest as Loadable).source = createSource(import.meta.url);
