
import { Loadable } from 'jitar-serialization';

export default class Teapot extends Error
{
    constructor()
    {
        super(`I'm a teapot`);
    }
}

(Teapot as Loadable).source = '/jitar/core/errors/Teapot.js';
