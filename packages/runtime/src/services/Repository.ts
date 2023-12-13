
import { ExecutionScope, ExecutionScopes } from '../definitions/ExecutionScope.js';

import File from '../models/File.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Runtime from './Runtime.js';

export default abstract class Repository extends Runtime
{
    async import(url: string, scope: ExecutionScope): Promise<Module>
    {
        if (scope === ExecutionScopes.RUNTIME)
        {
            return ModuleLoader.load(url);
        }
        
        return this.loadModule(url);
    }

    abstract registerClient(segmentFiles: string[]): Promise<string>;

    abstract readAsset(filename: string): Promise<File>;

    abstract readModule(name: string, clientId: string): Promise<File>;

    abstract loadModule(name: string): Promise<Module>;
}
