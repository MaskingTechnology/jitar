
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
import Imports from './types/Imports';

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
        for (const [filename, moduleImports] of Object.entries(definition))
        {
            this.#createModule(segment, filename, moduleImports, true);
        }
    }

    #createModule(segment: Segment, filename: string, moduleImports: Imports, segmented: boolean): void
    {
        const moduleFilename = this.#makeModuleFilename(filename);
        const location = this.#fileHelper.extractPath(moduleFilename);

        const module = segment.hasModule(moduleFilename)
            ? segment.getModule(moduleFilename) as Module
            : new Module(moduleFilename, location, {}, segmented);

        module.addImports(moduleImports);

        segment.setModule(module);
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
                this.#registerModuleMember(segment, module, importKey, idGenerator);
            }
        }
    }

    #registerModuleMember(segment: Segment, module: Module, importKey: string, idGenerator: IdGenerator): void
    {
        const { model, trace } = this.#memberLocator.locate(module.filename, importKey);
        
        const properties = this.#constructProperties(module, model, importKey, idGenerator);

        this.#createMember(segment, module, model, properties);

        trace.shift(); // Remove the first entry, as it is the module itself.

        for (const entry of trace)
        {
            const entryImport = { [entry.importKey]: { access: properties.access } };

            this.#createModule(segment, entry.filename, entryImport, false);
        }
    }

    #constructProperties(module: Module, model: ESMember, importKey: string, idGenerator: IdGenerator): MemberProperties
    {
        const configuration = module.imports[importKey];

        const id = idGenerator.next();
        const name = configuration.as ?? model.name;
        const access = configuration.access ?? Defaults.ACCESS_LEVEL;
        const version = configuration.version ?? Defaults.VERSION_NUMBER;
        const fqn = this.#constructFqn(module, name, importKey);

        return { id, importKey, name, access, version, fqn };
    }

    #constructFqn(module: Module, name: string, importKey: string): string
    {
        if (this.#isRootModule(module))
        {
            return name;
        }

        if (this.#isIndexModule(module) && this.#isDefaultImport(importKey))
        {
            return module.location;
        }

        return `${module.location}/${name}`;
    }

    #isRootModule(module: Module): boolean
    {
        return module.location === '';
    }

    #isIndexModule(module: Module): boolean
    {
        return module.filename.endsWith(Files.INDEX);
    }

    #isDefaultImport(importKey: string): boolean
    {
        return importKey === Keywords.DEFAULT;
    }

    #createMember(segment: Segment, module: Module, model: ESMember, properties: MemberProperties): void
    {
        if (model instanceof ESClass)
        {
            return this.#createClass(segment, module, model, properties);
        }
        
        if (model instanceof ESFunction)
        {
            return this.#createImplementation(segment, module, model, properties);
        }
        
        throw new InvalidModuleExport(module.filename, properties.importKey);
    }

    #createClass(segment: Segment, module: Module, model: ESClass, properties: MemberProperties): void
    {
        const clazz = new Class(properties.id, properties.importKey, properties.fqn, model);

        module.addMember(clazz);

        segment.setClass(clazz);
    }

    #createImplementation(segment: Segment, module: Module, model: ESFunction, properties: MemberProperties): void
    {
        if (model.isAsync === false)
        {
            throw new FunctionNotAsync(module.filename, properties.name);
        }

        const implementation = new Implementation(properties.id, properties.importKey, properties.fqn, properties.access, properties.version, model);

        this.#createProcedure(segment, module, implementation);
    }

    #createProcedure(segment: Segment, module: Module, implementation: Implementation): void
    {
        const procedure = segment.hasProcedure(implementation.fqn)
            ? segment.getProcedure(implementation.fqn) as Procedure
            : new Procedure(implementation.fqn);

        procedure.addImplementation(implementation);

        module.addMember(implementation);

        segment.setProcedure(procedure);
    }
}
