
import UrlRewriter from './UrlRewriter.js';
import Module from '../types/Module.js';
import ModuleImporter from '../types/ModuleImporter.js';
import ModuleNotLoaded from '../errors/ModuleNotLoaded.js';

const _importer = async (name: string): Promise<Module> => { return import(name); };

export default class ModuleLoader
{
    #urlRewriter: UrlRewriter;
    #importer: ModuleImporter;

    constructor(baseUrl: '/', importer = _importer)
    {
        this.#urlRewriter = new UrlRewriter(baseUrl);
        this.#importer = importer;
    }

    async load(url: string): Promise<Module>
    {
        url = this.#urlRewriter.rewrite(url);

        return this.#import(url);
    }

    async #import(specifier: string): Promise<Module>
    {
        try
        {
            return await this.#importer(specifier);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(specifier, message);
        }
    }
}
