
import ModuleNotLoaded from '../errors/ModuleNotLoaded.js';
import Module from '../types/Module.js';
import ModuleImporter from '../types/ModuleImporter.js';

import UrlRewriter from './UrlRewriter.js';

const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

let _baseUrl: string = '';
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

    static async load(specifier: string): Promise<Module>
    {
        try
        {
            return await _import(specifier);
        }
        catch (error: unknown)
        {
            const safeUrl = UrlRewriter.removeBase(specifier, _baseUrl);
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(safeUrl, message);
        }
    }
}
