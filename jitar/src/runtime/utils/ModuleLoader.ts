
import Module from '../../core/types/Module.js';

import ModuleNotLoaded from '../errors/ModuleNotLoaded.js';
import ModuleImporter from '../types/ModuleImporter.js';
import UrlRewriter from './UrlRewriter.js';

let _baseUrl: string | undefined;
let _import = async (name: string): Promise<Module> => { return import(name); };

export default class ModuleLoader
{
    static setBaseUrl(baseUrl: string): void
    {
        _baseUrl = baseUrl;
    }

    static setImporter(importer: ModuleImporter): void
    {
        _import = importer;
    }

    static async load(url: string): Promise<Module>
    {
        if (url.startsWith('/jitar'))
        {
            url = `../../${url}`;
        }

        if (_baseUrl !== undefined && url.startsWith(_baseUrl) === false)
        {
            url = UrlRewriter.addBase(url, _baseUrl);
        }

        return this.import(url) as Promise<Module>;
    }

    static async import(specifier: string)
    {
        try
        {
            return await _import(specifier);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(specifier, message);
        }
    }
}
