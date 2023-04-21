
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class NotFound extends Error
{
    constructor(message = 'Not found')
    {
        super(message);
    }
}

(NotFound as Loadable).source = createSource(import.meta.url);
