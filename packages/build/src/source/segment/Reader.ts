
import { ESFunction, ESClass, ESMember } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { FileHelper, IdGenerator } from '../../utils';
import type { ModuleRepository } from '../module';

import FunctionNotAsync from './errors/FunctionNotAsync';
import InvalidFilename from './errors/InvalidFilename';
import MissingModuleExport from './errors/MissingModuleExport';
import FileNotLoaded from './errors/FileNotLoaded';
import InvalidModuleExport from './errors/InvalidModuleExport';
import ModuleNotFound from './errors/ModuleNotFound';

import Segmentation from './models/Segmentation';
import Segment from './models/Segment';
import Module from './models/Module';
import Class from './models/Class';
import Procedure from './models/Procedure';
import Implementation from './models/Implementation';

import SegmentFile from './types/File';

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

const SEGMENT_FILE_EXTENSION = '.segment.json';
const DEFAULT_ACCESS_LEVEL = 'private';
const DEFAULT_VERSION_NUMBER = '0.0.0';

export default class SegmentReader
{
    #fileManager: FileManager;
    #repository: ModuleRepository;

    #fileHelper = new FileHelper();

    constructor(fileManager: FileManager, repository: ModuleRepository)
    {
        this.#fileManager = fileManager;
        this.#repository = repository;
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
            const content = await this.#fileManager.getContent(filename);

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
        const fullFilename = this.#fileHelper.assureExtension(filename);

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
            const model = this.#getMember(module.filename, importKey);

            const properties = module.imports[importKey];

            const name = properties.as ?? model.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const fqn = module.location !== '' ? `${module.location}/${name}` : name;

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

    #getMember(filename: string, importKey: string): ESMember
    {
        const module = this.#repository.get(filename);

        if (module === undefined)
        {
            throw new ModuleNotFound(filename);
        }

        const member = module.model.getExported(importKey);

        if (member === undefined)
        {
            throw new MissingModuleExport(filename, importKey);
        }

        return member;
    }
}
