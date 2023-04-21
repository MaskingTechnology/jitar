
import { ModuleNotAccessible, ModuleNotLoaded } from '@jitar/errors';

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

    static assureExtension(specifier: string): string
    {
        if (this.#isSystemModule(specifier))
        {
            return specifier;
        }

        return specifier.endsWith('.js') ? specifier : `${specifier}.js`;
    }

    static async load(specifier: string): Promise<Module>
    {
        let url = this.assureExtension(specifier);

        if (url.startsWith('/jitar'))
        {
            const aaa = import.meta.url.split('/');
            aaa.pop();
            const bbb = url.split('/');
            bbb.shift();
            bbb.shift();

            url = `${aaa.join('/')}/${bbb.join('/')}`;

            console.log('MODULE LOADER', url);

            return this.#import(url, specifier) as Promise<Module>;
        }

        if (_baseUrl !== undefined && url.startsWith(_baseUrl) === false)
        {
            url = UrlRewriter.addBase(url, _baseUrl);

            if (url.startsWith(_baseUrl) === false)
            {
                throw new ModuleNotAccessible(specifier);
            }
        }

        return this.#import(url, specifier) as Promise<Module>;
    }

    static async import(specifier: string): Promise<Module>
    {
        return this.#import(specifier, specifier);
    }

    static async #import(absolute: string, relative: string)
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

    static #isSystemModule(specifier: string): boolean
    {
        return NON_SYSTEM_INDICATORS.some((indicator: string) => specifier.startsWith(indicator)) === false;
    }
}
