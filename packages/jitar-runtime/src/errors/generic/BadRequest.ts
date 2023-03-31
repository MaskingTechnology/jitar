
import { Loadable } from 'jitar-serialization';

export default class BadRequest extends Error
{
    constructor(message = 'Invalid request')
    {
        super(message);
    }
}

(BadRequest as Loadable).source = '/jitar/errors/generic/BadRequest.js';
