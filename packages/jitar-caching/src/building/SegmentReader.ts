
import { ReflectionFunction, ReflectionModule, Reflector } from 'jitar-reflection';
import { FileManager } from 'jitar-runtime';

import InvalidSegmentFilename from './errors/InvalidSegmentFilename.js';
import MissingModuleExport from './errors/MissingModuleExport.js';
import SegmentFileNotLoaded from './errors/SegmentFileNotLoaded.js';
import SegmentModuleNotLoaded from './errors/SegmentModuleNotLoaded.js';

import Segment from './models/Segment.js';
import SegmentImplementation from './models/SegmentImplementation.js';
import SegmentModule from './models/SegmentModule';
import SegmentProcedure from './models/SegmentProcedure.js';

import SegmentFile from './types/SegmentFile.js';
import SegmentImports from './types/SegmentImports.js';

const SEGMENT_FILE_EXTENSION = '.segment.json';
const DEFAULT_ACCESS_LEVEL = 'private';
const DEFAULT_VERSION_NUMBER = '0.0.0';

const reflector = new Reflector();

export default class SegmentReader
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async read(filename: string): Promise<Segment>
    {
        const name = this.#extractSegmentName(filename);
        const definition = await this.#loadSegmentDefinition(filename);
        const modules = await this.#createSegmentModules(definition);

        return new Segment(name, modules);
    }

    #extractSegmentName(filename: string): string
    {
        const file = filename.split('/').pop();

        if (file === undefined)
        {
            throw new InvalidSegmentFilename(filename);
        }

        return file.replace(SEGMENT_FILE_EXTENSION, '');
    }

    async #loadSegmentDefinition(filename: string): Promise<SegmentFile>
    {
        try
        {
            const content = await this.#fileManager.getContent(filename);

            return JSON.parse(content.toString()) as SegmentFile;
        }
        catch (error: unknown)
        {
            throw new SegmentFileNotLoaded(filename);
        }
    }

    async #createSegmentModules(definition: SegmentFile): Promise<SegmentModule[]>
    {
        const modules: SegmentModule[] = [];

        for (const [filename, moduleImports] of Object.entries(definition))
        {
            const absoluteFilename = this.#fileManager.getAbsoluteLocation(filename);
            const module = await this.#createSegmentModule(absoluteFilename, moduleImports);

            modules.push(module);
        }

        return modules;
    }

    async #createSegmentModule(absoluteFilename: string, imports: SegmentImports): Promise<SegmentModule>
    {
        const module = await this.#loadSegmentModule(absoluteFilename);
        const relativeFilename = this.#fileManager.getRelativeLocation(absoluteFilename);
        const moduleName = this.#extractModuleName(relativeFilename);
        const procedures = this.#extractSegmentProcedures(module, moduleName, imports);
        
        return new SegmentModule(relativeFilename, procedures);
    }

    async #loadSegmentModule(absoluteLocation: string): Promise<ReflectionModule>
    {
        const code = await this.#fileManager.getContent(absoluteLocation);
        const module = reflector.parse(code.toString());

        if (module === undefined)
        {
            throw new SegmentModuleNotLoaded(absoluteLocation);
        }

        return module;
    }

    #extractModuleName(relativeFilename: string): string
    {
        const moduleParts = relativeFilename.split('/');
        moduleParts.pop();

        return moduleParts.join('/');
    }

    #extractSegmentProcedures(module: ReflectionModule, moduleName: string, imports: SegmentImports): SegmentProcedure[]
    {
        const procedures = new Map<string, SegmentProcedure>();

        let number = 0;

        for (const [importKey, properties] of Object.entries(imports))
        {
            const executable = module.getExported(importKey);

            if (executable === undefined)
            {
                throw new MissingModuleExport(moduleName, importKey);
            }
            else if ((executable instanceof ReflectionFunction) === false)
            {
                continue;
            }

            const procedureName = properties.as ?? executable.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const id = this.#createImplementationId(++number);
            const fqn = moduleName !== '' ? `${moduleName}/${procedureName}` : procedureName;

            const implementation = new SegmentImplementation(id, importKey, access, version, executable as ReflectionFunction);

            const procedure = procedures.has(fqn)
                ? procedures.get(fqn) as SegmentProcedure
                : new SegmentProcedure(fqn);

            procedure.addImplementation(implementation);

            procedures.set(fqn, procedure);
        }

        return [...procedures.values()];
    }

    #createImplementationId(number: number): string
    {
        return `$${number}`;
    }
}
