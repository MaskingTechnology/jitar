
import { ExecutionScopes } from '../definitions/ExecutionScope.js';

import File from '../models/File.js';
import Import from '../models/Import.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Runtime from './Runtime.js';

export default abstract class Repository extends Runtime
{
    async import(importModel: Import): Promise<Module>
    {
        if (importModel.scope === ExecutionScopes.RUNTIME)
        {
            return ModuleLoader.load(importModel.specifier);
        }
        
        return this.loadModule(importModel.specifier);
    }

    abstract readAsset(filename: string): Promise<File>;

    abstract readModule(caller: string, specifier: string): Promise<File>;

    abstract loadModule(specifier: string): Promise<Module>;
}
