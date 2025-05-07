
import ModuleNotLoaded from './errors/ModuleNotLoaded';
import ModuleLocator from './interfaces/ModuleLocator';

export default class RemoteModuleLocator implements ModuleLocator
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(location: string)
    {
        // This constructor is intentionally empty.
        // Remote module loading is currently not allowed due to security reasons.
    }

    locate(filename: string): string
    {
        throw new ModuleNotLoaded(filename, 'Remote module loading is not allowed');
    }
}
