
import path from 'node:path';

import { ConfigurationManager, BuildHelper } from 'jitar';
import { normalizePath, PluginOption, ResolvedConfig } from 'vite';

const JITAR_SOURCE_ID = 'jitar';
const JITAR_CLIENT_ID = 'jitar/client';
const JITAR_BUNDLE_ID = 'jitar-bundle';
const JITAR_BUNDLE_RESOLVE_ID = `\0${JITAR_BUNDLE_ID}`;

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
    let jitarImported = false;

    return {

        name: 'jitar-plugin-vite',
        enforce: 'pre',

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
            jitarImported = false;

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

        resolveId(source)
        {
            if (source === JITAR_BUNDLE_ID)
            {
                return JITAR_BUNDLE_RESOLVE_ID;
            }

            if (source === JITAR_SOURCE_ID)
            {
                return JITAR_BUNDLE_RESOLVE_ID;
            }

            return null;
        },

        load(id)
        {
            if (id === JITAR_BUNDLE_RESOLVE_ID)
            {
                jitarImported = true;

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

        transform(code, id)
        {
            // Import the Jitar bundle from the first application component

            const isFirstAppComponent = jitarImported === false
                                     && id.startsWith(paths.project.source!)
                                     && (id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.jsx') || id.endsWith('.tsx'));
            
            if (isFirstAppComponent)
            {
                return `import '${JITAR_BUNDLE_ID}';\n${code}`;
            }

            return code;
        }

    } as PluginOption;
}
