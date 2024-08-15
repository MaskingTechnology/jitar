
import File from '../models/File.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Runtime from './Runtime.js';

export default abstract class Repository extends Runtime
{
    async import(specifier: string): Promise<Module>
    {
        return ModuleLoader.load(specifier);
    }

    abstract readAsset(filename: string): Promise<File>;

    abstract readModule(specifier: string): Promise<File>;

    abstract loadModule(specifier: string): Promise<Module>;
}
