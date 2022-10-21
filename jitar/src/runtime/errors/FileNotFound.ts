
import Component from '../../core/types/Component.js';

export default class FileNotFound extends Error
{
    constructor(filename: string)
    {
        super(`The file '${filename} could not be found'`);
    }
}

(FileNotFound as Component).source = '/jitar/runtime/errors/FileNotFound.js';
