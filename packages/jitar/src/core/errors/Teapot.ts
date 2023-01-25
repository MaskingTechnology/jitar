
import Component from '../types/Component.js';

export default class Teapot extends Error
{
    constructor()
    {
        super(`I'm a teapot`);
    }
}

(Teapot as Component).source = '/jitar/core/errors/Teapot.js';
