
import { Loadable } from 'jitar-serialization';

export default class FileNotFound extends Error
{
    constructor(filename: string)
    {
        super(`The file '${filename} could not be found'`);
    }
}

(FileNotFound as Loadable).source = '/jitar/errors/FileNotFound.js';
