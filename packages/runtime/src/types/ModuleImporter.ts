
import Module from './Module.js';

type ModuleImporter = (name: string) => Promise<Module>;

export default ModuleImporter;
