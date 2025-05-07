
import type Module from '../types/Module';

interface ModuleImporter
{
    import(filename: string): Promise<Module>;
}

export default ModuleImporter;
