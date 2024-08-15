
import { ReflectionFunction } from '@jitar/reflection';
import type { FileManager } from '@jitar/runtime';

import type { ModuleRepository } from '../module';
import { FileHelper, IdGenerator } from '../utils';

import FunctionNotAsync from './errors/FunctionNotAsync';
import InvalidFilename from './errors/InvalidFilename';
import MissingModuleExport from './errors/MissingModuleExport';
import FileNotLoaded from './errors/FileNotLoaded';
import NotAFunction from './errors/NotAFunction';
import ModuleNotFound from './errors/ModuleNotFound';

import Segmentation from './models/Segmentation';
import Segment from './models/Segment';
import Module from './models/Module';
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
        const procedures = this.#createProcedures(modules);

        return new Segment(name, modules, procedures);
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

    #createProcedures(modules: Module[]): Procedure[]
    {
        const idGenerator = new IdGenerator();
        const procedures: Map<string, Procedure> = new Map();

        for (const module of modules)
        {
            this.#extractModuleProcedures(module, procedures, idGenerator);
        }

        return [...procedures.values()];
    }

    #extractModuleProcedures(module: Module, procedures: Map<string, Procedure>, idGenerator: IdGenerator): void
    {
        for (const [importKey, properties] of Object.entries(module.imports))
        {
            // To make sure that we create the correct FQN, we need to get the executable
            const executable = this.#getExecutable(module.filename, importKey);

            const procedureName = properties.as ?? executable.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const fqn = module.location !== '' ? `${module.location}/${procedureName}` : procedureName;
            const isDefault = importKey === 'default';

            const id = idGenerator.next();
            const implementation = new Implementation(id, importKey, fqn, access, version, isDefault, executable);

            module.addImplementation(implementation);

            const procedure = procedures.has(fqn)
                ? procedures.get(fqn) as Procedure
                : new Procedure(fqn);

            procedure.addImplementation(implementation);

            procedures.set(fqn, procedure);
        }
    }

    #getExecutable(filename: string, importKey: string): ReflectionFunction
    {
        const module = this.#repository.get(filename);

        if (module === undefined)
        {
            throw new ModuleNotFound(filename);
        }

        const executable = module.reflection.getExported(importKey) as ReflectionFunction;

        if (executable === undefined)
        {
            throw new MissingModuleExport(filename, importKey);
        }
        else if ((executable instanceof ReflectionFunction) === false)
        {
            throw new NotAFunction(filename, importKey);
        }
        else if (executable.isAsync === false)
        {
            throw new FunctionNotAsync(filename, executable.name);
        }

        return executable;
    }
}
