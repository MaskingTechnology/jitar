
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import InvalidName from './errors/InvalidName';
import UnknownTemplate from './errors/UnknownTemplate';

const TEMPLATES_LOCATION = 'templates';
const DEFAULT_PROJECT_ROOT_PATH = './';

const NAME_REGEX = /^[a-zA-Z.\-_]+$/;

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

            const stat = await fsp.stat(location);

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

        return fsp.cp(templateLocation, projectLocation, { recursive: true, force: true });
    }
}
