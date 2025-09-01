
import path from 'node:path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import InvalidName from './errors/InvalidName';
import UnknownTemplate from './errors/UnknownTemplate';

const TEMPLATES_LOCATION = 'templates';
const DEFAULT_PROJECT_ROOT_PATH = './';

const NAME_REGEX = /^[a-zA-Z.\-_]+$/;

const RENAME_FILES =
{
    '_gitignore': '.gitignore'
};

export default class InitManager
{
    readonly #templateRootPath: string;
    readonly #projectRootPath: string;

    constructor(rootPath: string = DEFAULT_PROJECT_ROOT_PATH)
    {
        this.#templateRootPath = this.#createTemplateRootPath();
        this.#projectRootPath = this.#createProjectRootPath(rootPath);
    }

    async init(projectName: string, templateName: string): Promise<void>
    {
        this.#validateName(projectName, 'project');
        this.#validateName(templateName, 'template');

        const templateVerified = await this.#verifyTemplateName(templateName);

        if (templateVerified === false)
        {
            throw new UnknownTemplate(templateName);
        }

        await this.#copyTemplate(projectName, templateName);

        this.#renameFiles(projectName);
    }

    #createTemplateRootPath(): string
    {
        const runtimePath = path.dirname(fileURLToPath(import.meta.url));
        
        return path.join(runtimePath, TEMPLATES_LOCATION);
    }

    #createProjectRootPath(rootPath: string): string
    {
        return path.resolve(rootPath);
    }

    #validateName(name: string, type: string): void
    {
        if (NAME_REGEX.test(name) === false)
        {
            throw new InvalidName(name, type);
        }
    }

    async #verifyTemplateName(templateName: string): Promise<boolean>
    {
        try
        {
            const location = path.join(this.#templateRootPath, templateName);

            const stat = await fs.stat(location);

            return stat.isDirectory();
        }
        catch
        {
            return false;
        }
    }

    #copyTemplate(projectName: string, templateName: string): Promise<void>
    {
        const templateLocation = path.join(this.#templateRootPath, templateName);
        const projectLocation = path.join(this.#projectRootPath, projectName);

        return fs.cp(templateLocation, projectLocation, { recursive: true, force: true });
    }

    async #renameFiles(projectName: string): Promise<void>
    {
        const projectLocation = path.join(this.#projectRootPath, projectName);

        const files = Object.entries(RENAME_FILES);
        const promises = [];

        for (const [source, target] of files)
        {
            const sourceFileLocation = path.join(projectLocation, source);
            const targetFileLocation = path.join(projectLocation, target);

            promises.push(fs.rename(sourceFileLocation, targetFileLocation));
        }

        await Promise.all(promises);
    }
}
