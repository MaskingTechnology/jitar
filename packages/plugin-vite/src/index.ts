
import fs from 'node:fs';
import path from 'node:path';

import { ConfigurationManager, BuildHelper } from 'jitar';
import { normalizePath, PluginOption, ResolvedConfig } from 'vite';

const JITAR_SOURCE_ID = 'jitar';
const JITAR_CLIENT_ID = 'jitar/client';
const JITAR_BUNDLE_ID = 'jitar-bundle';

function assureExtension(filename: string)
{
    if (filename.endsWith('.js'))
    {
        return filename;
    }

    return `${filename}.js`;
}

function createJitarBundle(middlewares: string[], targetPath: string)
{
    const middlewareFiles = middlewares.map(name => assureExtension(path.join(targetPath, name)));

    const jitarImport = `import { ClientBuilder, HttpRemoteBuilder } from "${JITAR_CLIENT_ID}";`;
    const middlewareImports = middlewareFiles.map((filename, index) => `import { default as $M${index} } from "${filename}";`).join('');
    const imports = [jitarImport, middlewareImports].join('\n');

    const remoteUrl = 'const remoteUrl = document.location.origin;';
    const segmentsArray = `const segments = [];`;
    const middlewareItems = middlewares.map((_, index) => `$M${index}`).join(', ');
    const middlewareArray = `const middleware = [${middlewareItems}];`;
    const declarations = [remoteUrl, segmentsArray, middlewareArray].join('\n');

    const remoteBuilder = 'const remoteBuilder = new HttpRemoteBuilder();';
    const clientBuilder = 'const clientBuilder = new ClientBuilder(remoteBuilder);';
    const build = 'const client = clientBuilder.build({remoteUrl, segments, middleware});';
    const start = 'client.start();';
    const client = [remoteBuilder, clientBuilder, build, start].join('\n');

    const exports = `export * from "${JITAR_CLIENT_ID}";`;

    return [imports, declarations, client, exports].join('\n');
}

type PluginConfig = {
    projectRoot: string;
    sourceRoot: string;
    configurationFile?: string;
    environmentFile?: string;
    jitarUrl: string;
    segments?: string[];
    middleware?: string[];
};

type PluginPaths = {
    vite: {
        input?: string;
        output?: string;
        assetOutput?: string;
    };
    project: {
        root?: string;
        source?: string;
    };
    jitar: {
        input?: string;
        output?: string;
    };
};

export type { PluginConfig as JitarConfig };

export default function viteJitar(pluginConfig: PluginConfig): PluginOption
{
    const jitarUrl = pluginConfig.jitarUrl;
    const segments = pluginConfig.segments ?? [];
    const middlewares = pluginConfig.middleware ?? [];

    const paths: PluginPaths =
    {
        vite: { input: undefined, output: undefined, assetOutput: undefined },
        project: { root: undefined, source: undefined },
        jitar: { input: undefined, output: undefined }
    };

    let buildHelper: BuildHelper;

    let jitarBundleFilename: string | undefined;
    let jitarBundleImported = false;

    return {

        name: 'jitar-plugin-vite',

        config()
        {
            return {
                build: { target: 'esnext' },
                server: { proxy: { '/rpc': jitarUrl } }
            };
        },

        configResolved(resolvedConfig: ResolvedConfig)
        {
            paths.vite.input = normalizePath(path.join(resolvedConfig.root));
            paths.vite.output = normalizePath(path.join(paths.vite.input, resolvedConfig.build.outDir));
            paths.vite.assetOutput = normalizePath(path.join(paths.vite.output, resolvedConfig.build.assetsDir));

            paths.project.root = normalizePath(path.join(paths.vite.input, pluginConfig.projectRoot));
            paths.project.source = normalizePath(path.join(paths.vite.input, pluginConfig.sourceRoot));
        },

        async buildStart()
        {
            const configurationManager = new ConfigurationManager(paths.project.root);

            if (pluginConfig.environmentFile !== undefined)
            {
                await configurationManager.configureEnvironment(pluginConfig.environmentFile);
            }

            const configuration = await configurationManager.getRuntimeConfiguration(pluginConfig.configurationFile);
            paths.jitar.input = normalizePath(path.join(paths.project.root!, configuration.source));
            paths.jitar.output = normalizePath(path.join(paths.project.root!, configuration.target));

            buildHelper = new BuildHelper(configuration);
            await buildHelper.readApplication();
        },

        options(options)
        {
            // Add the jitar client bundle to the input

            if (options.input === undefined)
            {
                options.input = JITAR_BUNDLE_ID;
            }
            else if (typeof options.input === 'string')
            {
                options.input = [options.input, JITAR_BUNDLE_ID];
            }
            else if (Array.isArray(options.input))
            {
                options.input.push(JITAR_BUNDLE_ID);
            }
            else if (typeof options.input === 'object')
            {
                options.input.additionalEntry = JITAR_BUNDLE_ID;
            }

            return options;
        },

        resolveId:
        {
            order: 'pre',
            async handler(source: string, importer: string | undefined)
            {
                if (source === JITAR_BUNDLE_ID)
                {
                    return source;
                }

                if (source === JITAR_SOURCE_ID)
                {
                    // Redirect all jitar imports to the jitar client bundle
                    // so we can bundle the client code with the application

                    if (importer?.endsWith('.segment.js') === false)
                    {
                        // Flag that the jitar bundle was imported by the application
                        // so we can avoid adding it to the HTML

                        jitarBundleImported = true;
                    }

                    return JITAR_BUNDLE_ID;
                }
            }
        },

        load(id)
        {
            if (id === JITAR_BUNDLE_ID)
            {
                return createJitarBundle(middlewares, paths.vite.output!);
            }

            if (id.startsWith(paths.project.source!))
            {
                if (id.startsWith(paths.vite.input!))
                {
                    return null;
                }

                const relativeId = id
                    .replace(paths.project.source!, '')
                    .replace('.ts', '.js');
                
                if (relativeId.endsWith('.js'))
                {
                    try
                    {
                        return buildHelper.generateModuleCode(relativeId, segments);
                    }
                    catch (error)
                    {
                        const message = error instanceof Error ? error.message : String(error);

                        console.error('ERROR:', message);
                        
                        return null;
                    }
                }
            }

            return null;
        },

        generateBundle(options, bundle)
        {
            // Find the jitar client bundle so we can add it later to the HTML

            const bundles = Object.entries(bundle);

            for (const [fileName, chunk] of bundles)
            {
                if (chunk.type === 'chunk' && chunk.name === JITAR_BUNDLE_ID)
                {
                    jitarBundleFilename = fileName;

                    break;
                }
            }
        },

        transformIndexHtml(html)
        {
            // Add the jitar client bundle to the HTML if it wasn't imported
            // by any of the application files.
            
            if (jitarBundleImported === true)
            {
                return html;
            }

            if (jitarBundleFilename === undefined)
            {
                // Dev mode: insert the pre generated jitar bundle

                if (paths.vite.assetOutput === undefined)
                {
                    console.warn('Output path not found!');

                    return html;
                }

                const filenames = fs.readdirSync(paths.vite.assetOutput);

                const jitarFilename = filenames.find(fileName => fileName.startsWith(JITAR_BUNDLE_ID) && fileName.endsWith('.js'));

                if (jitarFilename === undefined)
                {
                    console.warn('Jitar bundle not found! Did you build the application first?');

                    return html;
                }

                const jitarBundle = fs.readFileSync(path.join(paths.vite.assetOutput, jitarFilename), 'utf-8');

                return html.replace('<script', `<script type="module">${jitarBundle}</script>\n    <script`);
            }

            // Production mode: load the jitar bundle from the assets folder

            return html.replace('<script', `<script type="module" crossorigin src="/${jitarBundleFilename}"></script>\n    <script`);
        }

    } as PluginOption;
}
