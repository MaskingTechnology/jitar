
// This code is based on the create-vite code. Special thanks to the creators of this code.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';
import prompts from 'prompts';
import { red, reset } from 'kolorist';

import { Frameworks } from './definitions/Frameworks.js';

const VALID_PACKAGE_NAME_REGEX = /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/;

const argv = minimist<{
    t?: string
    template?: string
}>(process.argv.slice(2), { string: ['_'] });

const cwd = process.cwd();

const TEMPLATES = Frameworks.map(
    (f) => [f.name],
).reduce((a, b) => a.concat(b), []);

const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore'
};

const defaultTargetDir = 'jitar-project';

// eslint-disable-next-line sonarjs/cognitive-complexity
async function execute()
{
    const argTargetDir = formatTargetDir(argv._[0]);
    const argTemplate = argv.template || argv.t;

    let targetDir = argTargetDir ?? defaultTargetDir;

    const getProjectName = () => targetDir === '.'
        ? path.basename(path.resolve())
        : targetDir;

    let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework'>;

    try
    {
        result = await prompts(
            [
                {
                    type: argTargetDir ? null : 'text',
                    name: 'projectName',
                    message: reset('Project name:'),
                    initial: defaultTargetDir,
                    onState: (state) =>
                    {
                        targetDir = formatTargetDir(state.value) ?? defaultTargetDir;
                    },
                },
                {
                    type: () =>
                        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
                    name: 'overwrite',
                    message: () =>
                        (targetDir === '.'
                            ? 'Current directory'
                            : `Target directory "${targetDir}"`) +
                        ` is not empty. Remove existing files and continue?`,
                },
                {
                    type: (_, { overwrite }: { overwrite?: boolean }) =>
                    {
                        if (overwrite === false)
                        {
                            throw new Error(red('✖') + ' Operation cancelled');
                        }
                        return null;
                    },
                    name: 'overwriteChecker',
                    message: reset('Please enter to continue...')
                },
                {
                    type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
                    name: 'packageName',
                    message: reset('Package name:'),
                    initial: () => toValidPackageName(getProjectName()),
                    validate: (dir) =>
                        isValidPackageName(dir) || 'Invalid package.json name',
                },
                {
                    type:
                        argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
                    name: 'framework',
                    message:
                        typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
                            ? reset(
                                `"${argTemplate}" isn't a valid template. Please choose from below: `,
                            )
                            : reset('Select a framework:'),
                    initial: 0,
                    choices: Frameworks.map((framework) =>
                    {
                        const frameworkColor = framework.color;
                        return {
                            title: frameworkColor(framework.display || framework.name),
                            value: framework,
                        };
                    }),
                }
            ],
            {
                onCancel: () =>
                {
                    throw new Error(red('✖') + ' Operation cancelled');
                },
            },
        );
    }
    catch (cancelled: unknown)
    {
        const message = cancelled instanceof Error
            ? cancelled.message
            : String(cancelled);

        console.log(message);

        return;
    }

    // user choice associated with prompts
    const { framework, overwrite, packageName } = result;

    const root = path.join(cwd, targetDir);

    if (overwrite)
    {
        emptyDir(root);
    }
    else if (!fs.existsSync(root))
    {
        fs.mkdirSync(root, { recursive: true });
    }

    const template: string = framework?.name || argTemplate;

    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

    console.log(`\nScaffolding project in ${root}...`);

    const templateDir = path.resolve(
        fileURLToPath(import.meta.url),
        '../..',
        `templates/${template}`
    );

    const files = fs.readdirSync(templateDir);

    for (const file of files.filter((f) => f !== 'package.json'))
    {
        write(root, templateDir, file);
    }

    const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));

    pkg.name = packageName || getProjectName();

    write(root, templateDir, 'package.json', JSON.stringify(pkg, null, 2) + '\n');

    if (template === 'lit')
    {
        const config = JSON.parse(fs.readFileSync(path.join(templateDir, `services/standalone.json`), 'utf-8'));

        config.standalone.assets.push(`${getProjectName()}.js`);

        write(root, templateDir, 'services/standalone.json', JSON.stringify(config, null, 2) + '\n');
    }

    const cdProjectName = path.relative(cwd, root);

    console.log(`\nDone. Now run:\n`);

    if (root !== cwd)
    {
        const projectName = cdProjectName.includes(' ')
            ? `"${cdProjectName}"`
            : cdProjectName;

        console.log(`  cd ${projectName}`);
    }

    if (pkgManager === 'yarn')
    {
        console.log('  yarn');
        console.log('  yarn build');
        console.log('  yarn standalone');
    }
    else
    {
        console.log(`  ${pkgManager} install`);
        console.log(`  ${pkgManager} run build`);
        console.log(`  ${pkgManager} run standalone`);
    }

    console.log();
}

function write(root: string, templateDir: string, file: string, content?: string): void
{
    const targetPath = path.join(root, renameFiles[file] ?? file);

    if (content)
    {
        fs.writeFileSync(targetPath, content);

        return;
    }

    copy(path.join(templateDir, file), targetPath);
}

function formatTargetDir(targetDir: string | undefined): string | undefined
{
    return targetDir?.trim().replace(/\/+$/g, '');
}

function copy(src: string, dest: string): void
{
    const stat = fs.statSync(src);

    if (stat.isDirectory())
    {
        copyDir(src, dest);

        return;
    }

    fs.copyFileSync(src, dest);
}

function isValidPackageName(projectName: string): boolean
{
    return VALID_PACKAGE_NAME_REGEX.test(projectName);
}

function toValidPackageName(projectName: string): string
{
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z\d\-~]+/g, '-');
}

function copyDir(srcDir: string, destDir: string): void
{
    fs.mkdirSync(destDir, { recursive: true });

    for (const file of fs.readdirSync(srcDir))
    {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);

        copy(srcFile, destFile);
    }
}

function isEmpty(path: string): boolean
{
    const files = fs.readdirSync(path);

    return files.length === 0
        || (files.length === 1 && files[0] === '.git');
}

function emptyDir(dir: string): void
{
    if (!fs.existsSync(dir))
    {
        return;
    }

    for (const file of fs.readdirSync(dir))
    {
        if (file === '.git')
        {
            continue;
        }

        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
    }
}

function pkgFromUserAgent(userAgent: string | undefined)
{
    if (!userAgent) return undefined;

    const pkgSpec = userAgent.split(' ')[0];
    const pkgSpecArr = pkgSpec.split('/');

    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    };
}

execute().catch((e) =>
{
    console.error(e);
});
