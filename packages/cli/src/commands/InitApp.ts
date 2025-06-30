
import { InitManager } from '@jitar/init';

import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

export default class InitApp implements Command
{
    readonly name = 'init';
    readonly description = 'Initializes a new Jitar project from a template.';
    readonly options =
    [
        { key: '--name', required: true, description: 'Project name used for creating the project folder' },
        { key: '--template', required: true, description: 'Template to use [react, vue, jitar-only]' },
        { key: '--location', required: false, description: 'The root location of the project', defaultValue: './' }
    ];

    async execute(args: ArgumentProcessor): Promise<void>
    {
        const projectName = args.getRequiredArgument('--name');
        const templateName = args.getRequiredArgument('--template');
        const rootPath = args.getOptionalArgument('--location', undefined);

        this.#printStartupMessage(projectName, templateName);

        await this.#initProject(projectName, templateName, rootPath);

        this.#printNextSteps(projectName);
    }

    #printStartupMessage(projectName: string, templateName: string)
    {
        console.log(`Initializing project '${projectName}' with '${templateName}' template.`);
    }

    #initProject(projectName: string, templateName: string, rootPath?: string): Promise<void>
    {
        const initManager = new InitManager(rootPath);

        return initManager.init(projectName, templateName);
    }

    #printNextSteps(projectName: string)
    {
        console.log(`SUCCESS! Run the following commands to continue:\ncd ${projectName}\nnpm install\nnpm run build\nnpm run standalone`);
    }
}
