
import ModuleNotLoaded from './errors/ModuleNotLoaded';
import ModuleImporter from './interfaces/ModuleImporter';
import ModuleLocator from './interfaces/ModuleLocator';
import Module from './types/Module';

export default class ImportManager implements ModuleImporter
{
    readonly #moduleLocator: ModuleLocator;

    constructor(moduleLocator: ModuleLocator)
    {
        this.#moduleLocator = moduleLocator;
    }

    async import(filename: string): Promise<Module>
    {
        const location = this.#moduleLocator.locate(filename);
        
        try
        {
            // We must await here to catch and translate the error.

            return await import(location);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(location, message);
        }
    }
}
