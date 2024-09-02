
import path from 'path';
import fs from 'fs';

import { PluginOption, normalizePath, ResolvedConfig } from 'vite';

const BOOTSTRAPPING_ID = 'jitar-client';

function formatPath(path: string)
{
    path = normalizePath(path);

    if (path.startsWith('/'))
    {
        path = path.substring(1);
    }

    if (path.endsWith('/'))
    {
        path = path.substring(0, path.length - 1);
    }

    return path;
}

export default function viteJitar(sourcePath: string, jitarPath: string, jitarUrl: string, segments: string[] = [], middlewares: string[] = []): PluginOption
{
    sourcePath = formatPath(sourcePath);
    jitarPath = formatPath(jitarPath);

    const scopes = ['shared', ...segments, 'remote'];

    let jitarFullPath: string | undefined = undefined;

    return {

        name: 'jitar-plugin-vite',

        config()
        {
            return {
                build: { target: 'esnext' },
                server: { proxy: { '/rpc': jitarUrl }}
            };
        },

        configResolved(resolvedConfig: ResolvedConfig)
        {
            jitarFullPath = path.join(resolvedConfig.root, sourcePath, jitarPath);
        },

        options(options)
        {
            if (options.input === undefined)
            {
                options.input = BOOTSTRAPPING_ID;
            }
            else if (typeof options.input === 'string')
            {
                options.input = [options.input, BOOTSTRAPPING_ID];
            }
            else if (Array.isArray(options.input))
            {
                options.input.push(BOOTSTRAPPING_ID);
            }
            else if (typeof options.input === 'object')
            {
                options.input.additionalEntry = BOOTSTRAPPING_ID;
            }

            return options;
        },

        resolveId:
        {
            order: 'pre',
            async handler(source: string, importer: string | undefined, options: object)
            {
                if (source === BOOTSTRAPPING_ID)
                {
                    return source;
                }

                const resolution = await this.resolve(source, importer, options);

                if (resolution === null || jitarFullPath === undefined || resolution.id.includes(jitarFullPath) === false)
                {
                    return null;
                }

                const cacheId = resolution.id.replace('/src/', '/dist/');

                for (const scope of scopes)
                {
                    const scopeId = cacheId.replace('.ts', `.${scope}.js`);

                    if (fs.existsSync(scopeId))
                    {
                        return scopeId;
                    }
                }

                return resolution.id;
            }
        },

        load(id)
        {
            if (id !== BOOTSTRAPPING_ID)
            {
                return null;
            }

            const jitarImport = `import { buildClient } from "jitar/client";`;
            const middlewareImports = middlewares.map((middleware, index) => `import { default as $${index} } from "${middleware}";`).join('');

            const importFunction = `const importFunction = (specifier) => import(specifier);`;
            const middlewareArray = `const middlewares = [${middlewares.map((_, index) => `$${index}`).join(', ')}];`;

            const startClient = `buildClient(document.location.origin, importFunction, [], middlewares);`;

            return `${jitarImport}\n${middlewareImports}\n${importFunction}\n${middlewareArray}\n${startClient}`;
        }

    } as PluginOption;
}
