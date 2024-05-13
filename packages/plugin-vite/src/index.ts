
import path from 'path';
import { PluginOption, normalizePath, ResolvedConfig } from 'vite';
import { Reflector, ReflectionFunction } from '@jitar/reflection';

const reflector = new Reflector();

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

function createServerConfig(jitarUrl: string)
{
    return {
        build:
        {
            target: 'esnext'
        },
        server: {
            proxy: {
                '/rpc': jitarUrl,
                '/jitar': jitarUrl,
                '/modules': jitarUrl,
            }
        }
    };
}

function createBootstrapCode(segments: string[], middlewares: string[]): string
{
    const segmentString = segments.map(segment => `'${segment}'`).join(', ');
    const middlewareString = middlewares.map(middleware => `'${middleware}'`).join(', ');

    return `<script type="module">const jitar = await import("/jitar/client.js"); await jitar.startClient(document.location.origin, [${segmentString}], [${middlewareString}]);</script>`;
}

async function createImportCode(code: string, id: string, jitarFullPath: string, jitarPath: string): Promise<string>
{
    // Translate the id to a relative path with a .js extension
    const relativeId = id
        .replace(jitarFullPath, '')
        .replace('.ts', '.js');

    const module = reflector.parse(code);
    const exported = module.exported;

    // Extract all exports from the module
    const allKeys = [...exported.keys()];
    const functionKeys = allKeys.filter(key => key !== 'default' && exported.get(key) instanceof ReflectionFunction);

    let importCode = '';
    let exportCode = '';

    if (exported.has('default'))
    {
        importCode += `const defaultExport = module.default;\n`;
        exportCode += `export default defaultExport;\n`;
    }

    if (functionKeys.length > 0)
    {
        importCode += functionKeys.map(key => `const ${key} = module.${key};`).join('\n');
        exportCode += `export { ${functionKeys.join(', ')} };\n`;
    }

    return 'import { getClient, Import } from "/jitar/client.js";\n'
        + `const module = await (await getClient()).import(new Import("", "./${jitarPath}${relativeId}", "application", false));\n`
        + importCode
        + exportCode;
}

export default function viteJitar(sourcePath: string, jitarPath: string, jitarUrl: string, segments: string[] = [], middlewares: string[] = []): PluginOption
{
    sourcePath = formatPath(sourcePath);
    jitarPath = formatPath(jitarPath);

    let jitarFullPath: string | undefined = undefined;

    return {

        name: 'jitar-plugin-vite',
        enforce: 'post', // After Vite converted the code to JS
        //apply: '...', // Apply in serve and build mode

        config()
        {
            return createServerConfig(jitarUrl);
        },

        configResolved(resolvedConfig: ResolvedConfig)
        {
            jitarFullPath = path.join(resolvedConfig.root, sourcePath, jitarPath);
        },

        resolveId(id: string)
        {
            if (id === '/jitar/client.js')
            {
                return { id, external: 'absolute' };
            }

            return null;
        },

        async transform(code: string, id: string)
        {
            if (jitarFullPath === undefined
             || id.includes(jitarFullPath) === false)
            {
                return code;
            }

            return createImportCode(code, id, jitarFullPath, jitarPath);
        },

        transformIndexHtml(html)
        {
            return html.replace('<head>', `<head>${createBootstrapCode(segments, middlewares)}`);
        }

    } as PluginOption;
}
