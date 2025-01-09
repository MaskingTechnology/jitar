
import { ESFunction, ESClass } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { FileHelper, IdGenerator } from '../../utils';
import type { ModuleRepository } from '../module';

import FunctionNotAsync from './errors/FunctionNotAsync';
import InvalidFilename from './errors/InvalidFilename';
import FileNotLoaded from './errors/FileNotLoaded';
import InvalidModuleExport from './errors/InvalidModuleExport';

import Segmentation from './models/Segmentation';
import Segment from './models/Segment';
import Module from './models/Module';
import Class from './models/Class';
import Procedure from './models/Procedure';
import Implementation from './models/Implementation';

import SegmentFile from './types/File';

import MemberLocator from './MemberLocator';

type Members =
{
    classes: Map<string, Class>;
    procedures: Map<string, Procedure>
}

type MemberProperties =
{
    id: string;
    importKey: string;
    name: string;
    access: string;
    version: string;
    fqn: string;
}

const SEGMENT_FILE_EXTENSION = '.json';
const DEFAULT_ACCESS_LEVEL = 'private';
const DEFAULT_VERSION_NUMBER = '0.0.0';

export default class SegmentReader
{
    readonly #segmentsFileManager: FileManager;
    readonly #sourceFileManager: FileManager;
    readonly #memberLocator: MemberLocator;

    readonly #fileHelper = new FileHelper();

    constructor(segmentsFileManager: FileManager, sourceFileManager: FileManager, repository: ModuleRepository)
    {
        this.#segmentsFileManager = segmentsFileManager;
        this.#sourceFileManager = sourceFileManager;
        this.#memberLocator = new MemberLocator(repository);
    }

    async readAll(filenames: string[]): Promise<Segmentation>
    {
        const segments = await Promise.all(filenames.map(filename => this.read(filename)));

        return new Segmentation(segments);
    }

    async read(filename: string): Promise<Segment>
    {
        const definition = await this.#loadSegmentDefinition(filename);

        const name = this.#extractSegmentName(filename);
        const modules = this.#createModules(definition);
        const members = this.#createMembers(modules);

        const classes = [...members.classes.values()];
        const procedures = [...members.procedures.values()];

        return new Segment(name, modules, classes, procedures);
    }

    #extractSegmentName(filename: string): string
    {
        const file = filename.split('/').pop();

        if (file === undefined || file === '')
        {
            throw new InvalidFilename(filename);
        }

        return file.replace(SEGMENT_FILE_EXTENSION, '');
    }

    async #loadSegmentDefinition(filename: string): Promise<SegmentFile>
    {
        try
        {
            // The content of the segment file is located in a different folder than the source files.
            // The segment file manager has access to this location, the source file manager does not.

            const content = await this.#segmentsFileManager.getContent(filename);

            return JSON.parse(content.toString()) as SegmentFile;
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new FileNotLoaded(filename, message);
        }
    }

    #createModules(definition: SegmentFile): Module[]
    {
        const modules: Module[] = [];

        for (const [filename, moduleImports] of Object.entries(definition))
        {
            const moduleFilename = this.#makeModuleFilename(filename);
            const location = this.#extractLocation(moduleFilename);
            
            const module = new Module(moduleFilename, location, moduleImports);

            modules.push(module);
        }

        return modules;
    }

    #makeModuleFilename(filename: string): string
    {
        // For index resolution we need to read the source files and check
        // if the given filename is a directory.

        const fullFilename = this.#sourceFileManager.isDirectory(filename)
            ? `${filename}/index.js`
            : this.#fileHelper.assureExtension(filename);

        if (fullFilename.startsWith('./')) return fullFilename.substring(2);
        if (fullFilename.startsWith('/')) return fullFilename.substring(1);

        return fullFilename;
    }

    #extractLocation(filename: string): string
    {
        const moduleParts = filename.split('/');
        moduleParts.pop();

        return moduleParts.join('/');
    }

    #createMembers(modules: Module[]): Members
    {
        const members: Members = { classes: new Map(), procedures: new Map() };

        const idGenerator = new IdGenerator();

        for (const module of modules)
        {
            this.#extractModuleMembers(module, members, idGenerator);
        }

        return members;
    }

    #extractModuleMembers(module: Module, members: Members, idGenerator: IdGenerator): void
    {
        for (const importKey in module.imports)
        {
            const id = idGenerator.next();
            const model = this.#memberLocator.locate(module.filename, importKey);

            const properties = module.imports[importKey];

            const name = properties.as ?? model.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const fqn = this.#constructFqn(module, name, importKey);

            const memberProperties = { id, importKey, name, access, version, fqn };

            if (model instanceof ESClass)
            {
                this.#registerClassMember(module, members, model, memberProperties);

                continue;
            }

            if (model instanceof ESFunction)
            {
                this.#registerProcedureMember(module, members, model, memberProperties);

                continue;
            }
            
            throw new InvalidModuleExport(module.filename, importKey);
        }
    }

    #constructFqn(module: Module, name: string, importKey: string): string
    {
        if (module.location === '')
        {
            return name;
        }

        if (module.filename.endsWith('index.js') && importKey === 'default')
        {
            return module.location;
        }

        return `${module.location}/${name}`;
    }

    #registerClassMember(module: Module, members: Members, model: ESClass, properties: MemberProperties): void
    {
        const clazz = new Class(properties.id, properties.importKey, properties.fqn, model);

        module.addMember(clazz);

        members.classes.set(properties.fqn, clazz);
    }

    #registerProcedureMember(module: Module, members: Members, model: ESFunction, properties: MemberProperties): void
    {
        if (model.isAsync === false)
        {
            throw new FunctionNotAsync(module.filename, properties.name);
        }

        const implementation = new Implementation(properties.id, properties.importKey, properties.fqn, properties.access, properties.version, model);

        module.addMember(implementation);

        const procedure = members.procedures.has(implementation.fqn)
            ? members.procedures.get(implementation.fqn) as Procedure
            : new Procedure(implementation.fqn);

        procedure.addImplementation(implementation);

        members.procedures.set(implementation.fqn, procedure);
    }
}
