
// The default loader is used by the local repository
// and gets overridden by the remote repository

import ModuleLoader from '../utils/ModuleLoader.js';

let _loader: Function = ModuleLoader.import;

export function setDependencyLoader(loader: Function): void
{
    _loader = loader;
}

export async function getDependency(name: string): Promise<unknown>
{
    const module = await _loader(name);

    return module.default !== undefined ? module.default : module;
}
