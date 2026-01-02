
import ModuleNotLoaded from './errors/ModuleNotLoaded';
import ModuleLocator from './interfaces/ModuleLocator';

export default class RemoteModuleLocator implements ModuleLocator
{
    // This is a placeholder class because remote module loading
    // is currently not allowed due to security reasons.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(location: string)
    {
        // This constructor is intentionally empty.
        // In case we ever want to allow remote module loading,
        // we need the location to be passed in.
    }

    locate(filename: string): string
    {
        throw new ModuleNotLoaded(filename, 'Remote module loading is not allowed');
    }
}
