
// The default loader is used by the local repository
// and gets overridden by the remote repository

import ModuleLoader from '../utils/ModuleLoader.js';

const RUNS_IN_BROWSER = typeof window !== 'undefined';

let _loader: Function = (name: string) => ModuleLoader.import(name);

export function setDependencyLoader(loader: Function): void
{
    _loader = loader;
}

export async function getDependency(name: string): Promise<unknown>
{
    if (RUNS_IN_BROWSER && name === 'JITAR_LIBRARY_NAME')
    {
        name = 'RUNTIME_HOOKS_LOCATION';
    }

    const module = await _loader(name);

    return module.default !== undefined ? module.default : module;
}
