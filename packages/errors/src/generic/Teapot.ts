
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

export default class Teapot extends Error
{
    constructor()
    {
        super(`I'm a teapot`);
    }
}

(Teapot as Loadable).source = createSource(import.meta.url);
