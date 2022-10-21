
import Module from '../core/types/Module.js';

import File from './models/File.js';
import Runtime from './Runtime.js';

export default abstract class Repository extends Runtime
{
    abstract registerClient(segmentFiles: string[]): Promise<string>;

    abstract setRuntime(runtime: Runtime): Promise<void>;

    abstract loadAsset(filename: string): Promise<File>;

    abstract getModuleLocation(clientId: string): Promise<string>;

    abstract loadModule(clientId: string, filename: string): Promise<File>;

    abstract importModule(clientId: string, filename: string): Promise<Module>;
}
