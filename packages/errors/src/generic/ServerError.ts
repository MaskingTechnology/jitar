
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class ServerError extends Error
{
    constructor(message = 'Server error')
    {
        super(message);
    }
}

(ServerError as Loadable).source = createSource(import.meta.url);
