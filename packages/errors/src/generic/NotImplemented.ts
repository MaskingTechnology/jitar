
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class NotImplemented extends Error
{
    constructor(message = 'Not implemented')
    {
        super(message);
    }
}

(NotImplemented as Loadable).source = createSource(import.meta.url);
