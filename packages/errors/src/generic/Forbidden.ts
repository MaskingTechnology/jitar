
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class Forbidden extends Error
{
    constructor(message = 'Forbidden')
    {
        super(message);
    }
}

(Forbidden as Loadable).source = createSource(import.meta.url);
