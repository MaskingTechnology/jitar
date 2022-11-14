
import Module from '../../core/types/Module.js';

type ModuleImporter = (name: string) => Promise<Module>;

export default ModuleImporter;
