
import path from 'path';
import { PluginOption, normalizePath } from 'vite';

const IMPORT_PATTERN = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;

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
    }
}

function createBootstrapCode(segments: string[]): string
{
    const segmentString = segments.map(segment => `'${segment}'`).join(', ');

    return `<script type="module">const jitar = await import('/jitar/client.js'); await jitar.startClient(${segmentString});</script>`;
}

async function createImportCode(code: string, id: string, jitarFullPath: string, jitarPath: string): Promise<string>
{
    // Translate the id to a relative path with a .js extension
    const relativeId = id
        .replace(jitarFullPath, '')
        .replace('.ts', '.js');

    // Remove all imports from the code
    code = code.replace(IMPORT_PATTERN, () =>
    {
        return '';
    });

    // Later on, we need to strip the code further into an interface to make sure it can be imported
    // (we can than share and reuse this code for the Jitar cache builder)

    // Load the code as data url into a module
    const importData = Buffer.from(code).toString('base64');
    const importUrl = `data:text/javascript;base64,${importData}`;
    const module = await import(importUrl);

    // Extract all exports from the module
    const allKeys = Object.keys(module);
    const functionKeys = allKeys.filter(key => key !== 'default' && typeof module[key] === 'function');

    let importCode = '';
    let exportCode = '';

    if (allKeys.includes('default'))
    {
        importCode += `const defaultExport = module.default;\n`;
        exportCode += `export default defaultExport;\n`;
    }

    if (functionKeys.length > 0)
    {
        importCode += functionKeys.map(key => `const ${key} = module.${key};`).join('\n');
        exportCode += `export { ${functionKeys.join(', ')} };\n`;
    }

    return 'const jitar = await import(/* @vite-ignore */`/jitar/client.js`);\n'
        + 'const client = await jitar.getClient();\n'
        + `const module = await client.import('./${jitarPath}${relativeId}');\n`
        + importCode
        + exportCode;
}

export default function viteJitar(sourcePath: string, jitarPath: string, jitarUrl: string, segments: string[] = []): PluginOption
{
    sourcePath = formatPath(sourcePath);
    jitarPath = formatPath(jitarPath);

    let jitarFullPath: string | undefined = undefined;

    return {

        name: 'jitar-vite-plugin',
        enforce: 'post', // After Vite converted the code to JS
        //apply: '...', // Apply in serve and build mode

        config()
        {
            return createServerConfig(jitarUrl);
        },

        configResolved(resolvedConfig)
        {
            jitarFullPath = path.join(resolvedConfig.root, sourcePath, jitarPath);
        },

        resolveId(source)
        {
            if (source === '/jitar/client.js')
            {
                return { id: source, external: 'absolute' };
            }

            return null;
        },

        async transform(code, id)
        {
            if (jitarFullPath === undefined || id.includes(jitarFullPath) === false)
            {
                return code;
            }

            return await createImportCode(code, id, jitarFullPath, jitarPath);
        },

        transformIndexHtml(html)
        {
            return html.replace('<head>', `<head>${createBootstrapCode(segments)}`);
        }

    } as PluginOption;
}
