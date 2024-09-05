
import { ReflectionFunction, ReflectionClass, ReflectionMember } from '@jitar/reflection';
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

const SEGMENT_FILE_EXTENSION = '.segment.json';
const DEFAULT_ACCESS_LEVEL = 'private';
const DEFAULT_VERSION_NUMBER = '0.0.0';

export default class SegmentReader
{
    #fileManager: FileManager;
    #repository: ModuleRepository;

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
        const [classes, procedures] = this.#createMembers(modules);

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
        const fullFilename = FileHelper.assureExtension(filename);

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

    #createMembers(modules: Module[]): [Class[], Procedure[]]
    {
        const classes: Map<string, Class> = new Map();
        const procedures: Map<string, Procedure> = new Map();

        const idGenerator = new IdGenerator();

        for (const module of modules)
        {
            this.#extractModuleMembers(module, classes, procedures, idGenerator);
        }

        return [[...classes.values()], [...procedures.values()]];
    }

    #extractModuleMembers(module: Module, classes: Map<string, Class>, procedures: Map<string, Procedure>, idGenerator: IdGenerator): void
    {
        for (const [importKey, properties] of Object.entries(module.imports))
        {
            const id = idGenerator.next();
            const reflection = this.#getMember(module.filename, importKey);

            const name = properties.as ?? reflection.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const fqn = module.location !== '' ? `${module.location}/${name}` : name;

            if (reflection instanceof ReflectionClass)
            {
                const clazz = new Class(id, importKey, fqn, reflection);

                module.addMember(clazz);

                classes.set(fqn, clazz);
            }
            else if (reflection instanceof ReflectionFunction)
            {
                if (reflection.isAsync === false)
                {
                    throw new FunctionNotAsync(module.filename, reflection.name);
                }

                const implementation = new Implementation(id, importKey, fqn, access, version, reflection);

                module.addMember(implementation);

                const procedure = procedures.has(implementation.fqn)
                    ? procedures.get(implementation.fqn) as Procedure
                    : new Procedure(implementation.fqn);

                procedure.addImplementation(implementation);

                procedures.set(implementation.fqn, procedure);
            }
            else
            {
                throw new InvalidModuleExport(module.filename, importKey);
            }
        }
    }

    #getMember(filename: string, importKey: string): ReflectionMember
    {
        const module = this.#repository.get(filename);

        if (module === undefined)
        {
            throw new ModuleNotFound(filename);
        }

        const member = module.reflection.getExported(importKey);

        if (member === undefined)
        {
            throw new MissingModuleExport(filename, importKey);
        }

        return member;
    }
}
