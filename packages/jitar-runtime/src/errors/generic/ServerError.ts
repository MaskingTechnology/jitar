
import { Loadable } from 'jitar-serialization';

export default class ServerError extends Error
{
    constructor(message = 'Server error')
    {
        super(message);
    }
}

(ServerError as Loadable).source = '/jitar-runtime/errors/generic/Teapot.js';
