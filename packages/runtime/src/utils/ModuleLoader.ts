
import ModuleNotAccessible from '../errors/ModuleNotAccessible.js';
import ModuleNotLoaded from '../errors/ModuleNotLoaded.js';

import Module from '../types/Module.js';
import ModuleImporter from '../types/ModuleImporter.js';

import UrlRewriter from './UrlRewriter.js';

const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

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

    static async load(specifier: string): Promise<Module>
    {
        if (this.#isSystemModule(specifier))
        {
            return this.#import(specifier, specifier);
        }

        let url = this.assureExtension(specifier);

        if (url.startsWith('/jitar'))
        {
            specifier = 'JITAR_LIBRARY_NAME';
            
            return this.#import(specifier, specifier) as Promise<Module>;
        }

        if (_baseUrl !== undefined && url.startsWith(_baseUrl) === false)
        {
            url = UrlRewriter.addBase(url, _baseUrl);

            if (url.startsWith(_baseUrl) === false)
            {
                throw new ModuleNotAccessible(specifier);
            }
        }

        return this.#import(url, specifier);
    }

    static assureExtension(specifier: string): string
    {
        return specifier.endsWith('.js') ? specifier : `${specifier}.js`;
    }

    static #isSystemModule(specifier: string): boolean
    {
        return NON_SYSTEM_INDICATORS.some((indicator: string) => specifier.startsWith(indicator)) === false;
    }

    static async #import(absolute: string, relative: string): Promise<Module>
    {
        try
        {
            return await _import(absolute);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(relative, message);
        }
    }
}
