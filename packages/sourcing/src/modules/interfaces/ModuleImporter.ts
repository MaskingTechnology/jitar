
import type Module from '../types/Module';

export default interface ModuleImporter
{
    import(specifier: string): Promise<Module>;
}
