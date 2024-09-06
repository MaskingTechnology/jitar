
import path from 'path';
import fs from 'fs';

import { PluginOption, normalizePath, ResolvedConfig } from 'vite';

const BOOTSTRAPPING_ID = 'jitar-client';

function formatDir(dir: string)
{
    dir = normalizePath(dir);

    if (dir.startsWith('/'))
    {
        dir = dir.substring(1);
    }

    if (dir.endsWith('/'))
    {
        dir = dir.substring(0, dir.length - 1);
    }

    return dir;
}

function assureExtension(filename: string)
{
    if (filename.endsWith('.js'))
    {
        return filename;
    }

    return `${filename}.js`;
}

type PluginConfig =
{
    sourceDir: string;
    targetDir: string;
    jitarDir: string;
    jitarUrl: string;
    segments?: string[];
    middleware?: string[];
};

export default function viteJitar(pluginConfig: PluginConfig): PluginOption
{
    const sourceDir = formatDir(pluginConfig.sourceDir);
    const targetDir = formatDir(pluginConfig.targetDir);
    const jitarDir = formatDir(pluginConfig.jitarDir);
    const jitarUrl = pluginConfig.jitarUrl;
    const segments = pluginConfig.segments ?? [];
    const middlewares = pluginConfig.middleware ?? [];

    const scopes = ['shared', ...segments, 'remote'];

    let rootPath: string | undefined;
    let sourcePath: string | undefined;
    let targetPath: string | undefined;
    let jitarPath: string | undefined;
    let jitarBundleFilename: string | undefined;

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
            rootPath = path.join(resolvedConfig.root);
            sourcePath = path.join(rootPath, sourceDir);
            targetPath = path.join(rootPath, targetDir);
            jitarPath = path.join(sourcePath, jitarDir);
        },

        options(options)
        {
            // Add the jitar client bundle to the input

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

                if (resolution === null || jitarPath === undefined || resolution.id.includes(jitarPath) === false)
                {
                    return null;
                }

                const cacheId = resolution.id.replace(`/${sourceDir}/`, `/${targetDir}/`);

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
            // Create the jitar client bundle content
            
            if (id !== BOOTSTRAPPING_ID)
            {
                return null;
            }

            const segmentFiles = segments.map(name => `${targetPath}/${name}.segment.js`);
            const middlewareFiles = middlewares.map(name => assureExtension(`${targetPath}/${name}`));

            const jitarImport = `import { buildClient } from "jitar";`;
            const segmentImports = segmentFiles.map((filename, index) => `import { default as $S${index} } from "${filename}";`).join('');
            const middlewareImports = middlewareFiles.map((filename, index) => `import { default as $M${index} } from "${filename}";`).join('');

            const segmentsArray = `const segments = [${segments.map((_, index) => `$S${index}`).join(', ')}];`;
            const middlewareArray = `const middlewares = [${middlewares.map((_, index) => `$M${index}`).join(', ')}];`;

            const startClient = `buildClient(document.location.origin, segments, middlewares);`;

            return `${jitarImport}\n${segmentImports}\n${middlewareImports}\n${segmentsArray}\n${middlewareArray}\n${startClient}`;
        },

        generateBundle(options, bundle)
        {
            // Find the jitar client bundle so we can add it later to the HTML

            const bundles = Object.entries(bundle);

            for (const [fileName, chunk] of bundles)
            {
                if (chunk.type === 'chunk' && chunk.name === BOOTSTRAPPING_ID)
                {
                    jitarBundleFilename = fileName;

                    break;
                }
            }
        },

        transformIndexHtml(html)
        {
            // Add the jitar client bundle to the HTML

            if (jitarBundleFilename === undefined)
            {
                console.warn('Jitar bundle not found!');

                return html;
            }

            return html.replace('<script', `<script type="module" crossorigin src="/${jitarBundleFilename}"></script>\n    <script`);
        }

    } as PluginOption;
}
