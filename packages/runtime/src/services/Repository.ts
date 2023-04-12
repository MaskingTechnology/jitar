
import File from '../models/File.js';
import Module from '../types/Module.js';

import Runtime from './Runtime.js';

export default abstract class Repository extends Runtime
{
    abstract registerClient(segmentFiles: string[]): Promise<string>;

    abstract loadAsset(filename: string): Promise<File>;

    abstract getModuleLocation(clientId: string): Promise<string>;

    abstract loadModule(clientId: string, filename: string): Promise<File>;

    abstract importModule(clientId: string, filename: string): Promise<Module>;
}
