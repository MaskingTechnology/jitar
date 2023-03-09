
import { FileManager } from 'jitar-runtime';

import ImportRewriter from './ImportRewriter.js';
import SourceAppender from './SourceAppender.js';
import RemoteBuilder from './RemoteBuilder.js';

import ModuleCache from './models/ModuleCache.js';

const importRewriter = new ImportRewriter();
const sourceAppender = new SourceAppender();
const remoteBuilder = new RemoteBuilder();

export default class ModuleCacheWriter
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async write(cache: ModuleCache): Promise<void>
    {

    }
}
