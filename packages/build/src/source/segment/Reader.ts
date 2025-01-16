
import { ESFunction, ESClass, ESMember } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { Defaults, Files, Keywords } from '../../definitions';
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

type MemberProperties =
{
    id: string;
    importKey: string;
    name: string;
    access: string;
    version: string;
    fqn: string;
}

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
        const segments = await Promise.all(filenames.map(filename => this.#read(filename)));

        return new Segmentation(segments);
    }

    async #read(filename: string): Promise<Segment>
    {
        const definition = await this.#loadSegmentDefinition(filename);
        const name = this.#extractSegmentName(filename);

        const segment = new Segment(name);

        this.#registerModules(segment, definition);
        this.#registerMembers(segment);

        return segment;
    }

    #extractSegmentName(filename: string): string
    {
        const file = filename.split('/').pop();

        if (file === undefined || file === '')
        {
            throw new InvalidFilename(filename);
        }

        return file.replace(Files.JSON, '');
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

    #registerModules(segment: Segment, definition: SegmentFile): void
    {
        const modules: Module[] = [];

        console.log('SEGMENT');

        for (const [filename, moduleImports] of Object.entries(definition))
        {
            const moduleFilename = this.#makeModuleFilename(filename);
            const location = this.#fileHelper.extractPath(moduleFilename);
            
            console.log('EXPLICIT', moduleFilename, location, moduleImports);
            const module = new Module(moduleFilename, location, moduleImports);

            segment.setModule(module);
        }
    }

    #makeModuleFilename(filename: string): string
    {
        // For index resolution we need to read the source files and check
        // if the given filename is a directory.

        const fullFilename = this.#sourceFileManager.isDirectory(filename)
            ? `${filename}/${Files.INDEX}`
            : this.#fileHelper.assureExtension(filename);

        if (fullFilename.startsWith('./')) return fullFilename.substring(2);
        if (fullFilename.startsWith('/')) return fullFilename.substring(1);

        return fullFilename;
    }

    #registerMembers(segment: Segment): void
    {
        const idGenerator = new IdGenerator();

        for (const module of segment.modules)
        {
            for (const importKey in module.imports)
            {
                this.#extractModuleMember(segment, module, importKey, idGenerator);
            }
        }
    }

    #extractModuleMember(segment: Segment, module: Module, importKey: string, idGenerator: IdGenerator): void
    {
        const member = this.#memberLocator.locate(module.filename, importKey);
        const model = member.model;

        const properties = module.imports[importKey];

        const name = properties.as ?? model.name;
        const access = properties.access ?? Defaults.ACCESS_LEVEL;
        const version = properties.version ?? Defaults.VERSION_NUMBER;

        const id = idGenerator.next();
        const fqn = this.#constructFqn(module, name, importKey);

        const memberProperties = { id, importKey, name, access, version, fqn };

        this.#registerMember(segment, module, importKey, model, memberProperties);

        if (member.trace.length > 0)
        {
            const trace = [...member.trace];

            trace.shift();

            for (const entry of trace)
            {
                const moduleFilename = this.#makeModuleFilename(entry.filename);
                const location = this.#fileHelper.extractPath(moduleFilename);
                const imports = { [entry.importKey]: { access } }

                console.log('IMPLICIT', moduleFilename, location, imports);
                const module = new Module(moduleFilename, location, imports);

                segment.setModule(module);

                this.#registerMember(segment, module, entry.importKey, model, memberProperties);
            }
        }
    }

    #registerMember(segment: Segment, module: Module, importKey: string, model: ESMember, properties: MemberProperties): void
    {
        if (model instanceof ESClass)
        {
            this.#registerClassMember(segment, module, model, properties);
        }
        else if (model instanceof ESFunction)
        {
            this.#registerProcedureMember(segment, module, model, properties);
        }
        else
        {
            throw new InvalidModuleExport(module.filename, importKey);
        }
    }

    #constructFqn(module: Module, name: string, importKey: string): string
    {
        if (module.location === '')
        {
            return name;
        }

        if (module.filename.endsWith(Files.INDEX) && importKey === Keywords.DEFAULT)
        {
            return module.location;
        }

        return `${module.location}/${name}`;
    }

    #registerClassMember(segment: Segment, module: Module, model: ESClass, properties: MemberProperties): void
    {
        const clazz = new Class(properties.id, properties.importKey, properties.fqn, model);

        module.addMember(clazz);
        segment.setClass(clazz);
    }

    #registerProcedureMember(segment: Segment, module: Module, model: ESFunction, properties: MemberProperties): void
    {
        if (model.isAsync === false)
        {
            throw new FunctionNotAsync(module.filename, properties.name);
        }

        const implementation = new Implementation(properties.id, properties.importKey, properties.fqn, properties.access, properties.version, model);

        module.addMember(implementation);

        const procedure = segment.hasProcedure(implementation.fqn)
            ? segment.getProcedure(implementation.fqn) as Procedure
            : new Procedure(implementation.fqn);

        procedure.addImplementation(implementation);

        segment.setProcedure(procedure);
    }
}
