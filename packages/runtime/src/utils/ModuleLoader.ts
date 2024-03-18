
import ModuleNotAccessible from '../errors/ModuleNotAccessible.js';
import ModuleNotLoaded from '../errors/ModuleNotLoaded.js';

import Module from '../types/Module.js';
import ModuleImporter from '../types/ModuleImporter.js';
import Environment from './Environment.js';

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
        if (this.#isSystemModule(specifier))
        {
            return this.#import(specifier);
        }

        if (specifier.startsWith('/jitar'))
        {
            return Environment.isServer()
                ? this.#import('JITAR_LIBRARY_NAME')
                : this.#import(specifier);
        }

        const filename = this.assureExtension(specifier);
        const url = UrlRewriter.addBase(filename, _baseUrl);

        if (url.startsWith(_baseUrl) === false)
        {
            throw new ModuleNotAccessible(specifier);
        }

        return this.#import(url);
    }

    static assureExtension(specifier: string): string
    {
        return specifier.endsWith('.js') ? specifier : `${specifier}.js`;
    }

    static #isSystemModule(specifier: string): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some((indicator: string) => specifier.startsWith(indicator)) === false;
    }

    static async #import(specifier: string): Promise<Module>
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
