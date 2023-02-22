
import * as AccessLevel from '../../core/definitions/AccessLevel.js';
import Version from '../../core/Version.js';

import FileManager from '../interfaces/FileManager.js';
import ModuleAnalyser from '../utils/ModuleAnalyser.js';

import SourceAppender from './SourceAppender.js';
import ImportRewriter from './ImportRewriter.js';
import RemoteBuilder from './RemoteBuilder.js';

import SegmentFile from './types/SegmentFile.js';
import SegmentImports from './types/SegmentImports.js';

import ApplicationModule from './models/ApplicationModule.js';
import Procedure from './models/Procedure.js';
import Segment from './models/Segment.js';
import SegmentModule from './models/SegmentModule.js';
import Implementation from './models/Implementation.js';

import SegmentFileNotLoaded from './errors/SegmentFileNotLoaded.js';
import SegmentModuleNotLoaded from './errors/SegmentModuleNotLoaded.js';
import MissingModuleExport from './errors/MissingModuleExport.js';
import InvalidSegmentFilename from './errors/InvalidSegmentFilename.js';

import { ReflectionFunction, ReflectionModule, Reflector } from 'jitar-reflection';

const IGNORED_SOURCE_FILES = ['.min.js'];

const DEFAULT_ACCESS_LEVEL = AccessLevel.PRIVATE;
const DEFAULT_VERSION_NUMBER = Version.DEFAULT.toString();

const reflector = new Reflector();

export default class CacheBuilder
{
    #sourceManager: FileManager;
    #cacheManager: FileManager;

    constructor(sourceManager: FileManager, cacheManager: FileManager)
    {
        this.#sourceManager = sourceManager;
        this.#cacheManager = cacheManager;
    }

    async build(segmentFiles: string[], moduleFiles: string[]): Promise<void>
    {
        const applicationFiles = this.#filterApplicationFiles(moduleFiles);

        const segments = await this.#createSegments(segmentFiles);
        const applicationModules = await this.#createApplicationModules(applicationFiles);

        await this.#buildSegmentCache(segments);
        await this.#buildApplicationCache(applicationModules);
    }

    #filterApplicationFiles(fileNames: string[]): string[]
    {
        return fileNames.filter(filename => this.#mustIgnoreFile(filename) === false);
    }

    #mustIgnoreFile(filename: string): boolean
    {
        return IGNORED_SOURCE_FILES.some((ignored) => filename.endsWith(ignored));
    }

    async #createSegments(filenames: string[]): Promise<Segment[]>
    {
        const promises = filenames.map(async (filename) => this.#createSegment(filename));

        return Promise.all(promises).then(segments => segments);
    }

    async #createSegment(filename: string): Promise<Segment>
    {
        const definition = await this.#loadSegmentDefinition(filename);
        const modules = await this.#createSegmentModules(definition);
        const procedures = this.#createSegmentProcedures(modules);

        return new Segment(filename, modules, procedures);
    }

    async #loadSegmentDefinition(filename: string): Promise<SegmentFile>
    {
        try
        {
            const content = await this.#sourceManager.getContent(filename);

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

        for (const [moduleFilename, moduleImports] of Object.entries(definition))
        {
            const absoluteLocation = this.#sourceManager.getAbsoluteLocation(moduleFilename);
            const module = await this.#createSegmentModule(absoluteLocation, moduleImports);

            modules.push(module);
        }

        return modules;
    }

    async #createSegmentModule(absoluteLocation: string, imports: SegmentImports): Promise<SegmentModule>
    {
        const exports = await this.#loadSegmentModule(absoluteLocation);
        const implementations = await this.#createSegmentModuleImplementations(absoluteLocation, exports, imports);

        return new SegmentModule(absoluteLocation, exports, implementations);
    }

    async #loadSegmentModule(absoluteLocation: string): Promise<ReflectionModule>
    {
        const module = await this.#loadModule(absoluteLocation);

        if (module === undefined)
        {
            throw new SegmentModuleNotLoaded(absoluteLocation);
        }

        return module;
    }

    async #createSegmentModuleImplementations(absoluteLocation: string, exports: ReflectionModule, imports: SegmentImports): Promise<Map<string, Implementation>>
    {
        const moduleName = this.#extractModuleName(absoluteLocation);
        const implementations: Map<string, Implementation> = new Map();

        for (const [importKey, properties] of Object.entries(imports))
        {
            const executable = exports.getExported(importKey) as ReflectionFunction;

            if (executable === undefined)
            {
                throw new MissingModuleExport(moduleName, importKey);
            }

            const procedureName = properties.as ?? executable.name;
            const access = properties.access ?? DEFAULT_ACCESS_LEVEL;
            const version = properties.version ?? DEFAULT_VERSION_NUMBER;

            const implementation = new Implementation(moduleName, procedureName, access, version, executable);

            implementations.set(importKey, implementation);
        }

        return implementations;
    }

    #createSegmentProcedures(modules: SegmentModule[]): Map<string, Procedure>
    {
        const procedures = new Map<string, Procedure>();

        for (const module of modules)
        {
            for (const implementation of module.implementations.values())
            {
                let procedure = procedures.get(implementation.fqn);

                if (procedure === undefined)
                {
                    procedure = new Procedure(implementation.module, implementation.name);

                    procedures.set(implementation.fqn, procedure);
                }

                procedure.addImplementation(implementation);
            }
        }

        return procedures;
    }

    #extractModuleName(absoluteLocation: string): string
    {
        const relativeLocation = this.#sourceManager.getRelativeLocation(absoluteLocation);

        const moduleParts = relativeLocation.split('/');
        moduleParts.pop();

        return moduleParts.join('/');
    }

    async #createApplicationModules(filenames: string[]): Promise<ApplicationModule[]>
    {
        const promises = filenames.map(async (filename) => this.#createApplicationModule(filename));

        return Promise.all(promises).then(results => results);
    }

    async #createApplicationModule(filename: string): Promise<ApplicationModule>
    {
        const module = await this.#loadModule(filename);
        const relativeLocation = this.#sourceManager.getRelativeLocation(filename);

        if (module === undefined)
        {
            return new ApplicationModule(relativeLocation, new Map(), new Map());
        }

        const classes = ModuleAnalyser.filterClasses(module);
        const functions = ModuleAnalyser.filterFunctions(module);

        return new ApplicationModule(relativeLocation, classes, functions);
    }

    async #loadModule(filename: string): Promise<ReflectionModule>
    {
        console.log('LOAD', filename);
        const code = await this.#sourceManager.getContent(filename);

        return reflector.parse(code.toString());
    }

    async #buildSegmentCache(segments: Segment[]): Promise<void[]>
    {
        const promises = segments.map(async (segment) => this.#buildSegmentModuleCache(segment));

        return Promise.all(promises);
    }

    async #buildSegmentModuleCache(segment: Segment): Promise<void>
    {
        await this.#buildSegmentCacheForRepository(segment);
        await this.#buildSegmentCacheForNode(segment);
    }

    async #buildSegmentCacheForRepository(segment: Segment): Promise<void>
    {
        return this.#buildSegmentDefinitionForRepository(segment);
    }

    async #buildSegmentDefinitionForRepository(segment: Segment): Promise<void>
    {
        // For the repository we need to make a definition file that contains all segment filenames
        // used for building a lookup table (mapping source files to segments).

        const code = this.#createSegmentRepositoryCode(segment);
        const filename = this.#createSegmentRepositoryFilename(segment);

        return this.#cacheManager.store(filename, code);
    }

    #createSegmentRepositoryCode(segment: Segment): string
    {
        const filenames = segment.getFilenames();
        const relativeLocations = filenames.map(filename => this.#sourceManager.getRelativeLocation(filename));

        return `export const files = [\n\t"${[...relativeLocations].join('",\n\t"')}"\n];`;
    }

    #createSegmentRepositoryFilename(segment: Segment): string
    {
        const filename = this.#extractSegmentFilename(segment);

        return filename.replace('.json', '.repository.js');
    }

    async #buildSegmentCacheForNode(segment: Segment): Promise<void>
    {
        await this.#buildSegmentDefinitionForNode(segment);
        await this.#buildSegmentModulesForNode(segment);
    }

    async #buildSegmentDefinitionForNode(segment: Segment): Promise<void>
    {
        // For the node we need to make a definition file that imports all segment procedures
        // and exports them as a segment model containing the procedures with the meta-data.

        const code = this.#createSegmentNodeCode(segment);
        const filename = this.#createSegmentNodeFilename(segment);

        return this.#cacheManager.store(filename, code);
    }

    #createSegmentNodeCode(segment: Segment): string
    {
        const importCode = this.#createSegmentImportCode(segment);
        const modelCode = this.#createSegmentModelCode(segment);

        return `${importCode}\n\n${modelCode}`;
    }

    #createSegmentImportCode(segment: Segment): string
    {
        const codes: string[] = [];

        for (const module of segment.modules)
        {
            const relativeLocation = this.#sourceManager.getRelativeLocation(module.filename);
            const imports: string[] = [];

            for (const [importKey, implementation] of module.implementations)
            {
                imports.push(`${importKey} as $${implementation.id}`);
            }

            codes.push(`import { ${imports.join(',')} } from "./${relativeLocation}";`);
        }

        return codes.join('\n');
    }

    #createSegmentModelCode(segment: Segment): string
    {
        const procedureCode: string[] = [];

        for (const procedure of segment.procedures.values())
        {
            const implementationCode: string[] = [];

            for (const implementation of procedure.implementations)
            {
                implementationCode.push(`{ access: "${implementation.access}", version: "${implementation.version}", executable: $${implementation.id} }`);
            }

            procedureCode.push(`{ module: "${procedure.module}", name: "${procedure.name}", implementations: [\n\t\t${implementationCode.join(',\n\t\t')}\n\t]}`);
        }

        return `export const procedures = [\n\t${procedureCode.join(',\n\t')}\n];`;
    }

    async #buildSegmentModulesForNode(segment: Segment): Promise<void>
    {
        // For the node we need to create two new module files:
        // 1) A copy of the original module file with distribution safe imports.
        // 2) A remake of the original module file with remote implementations only.

        for (const module of segment.modules)
        {
            const filename = module.filename;

            const absoluteLocation = this.#sourceManager.getAbsoluteLocation(filename);
            const relativeLocation = this.#sourceManager.getRelativeLocation(filename);

            const file = await this.#sourceManager.load(absoluteLocation);
            const code = file.content.toString();

            await this.#buildSegmentModuleForLocal(code, relativeLocation);
            await this.#buildSegmentModuleForRemote(module, relativeLocation);
        }
    }

    async #buildSegmentModuleForLocal(code: string, location: string): Promise<void>
    {
        const importedCode = ImportRewriter.rewrite(code);
        const nodeLocation = location.replace('.js', '.local.js');

        return this.#cacheManager.store(nodeLocation, importedCode);
    }

    async #buildSegmentModuleForRemote(module: SegmentModule, location: string): Promise<void>
    {
        const remoteCode = RemoteBuilder.build(module);
        const remoteLocation = location.replace('.js', '.remote.js');

        return this.#cacheManager.store(remoteLocation, remoteCode);
    }

    #createSegmentNodeFilename(segment: Segment): string
    {
        const filename = this.#extractSegmentFilename(segment);

        return filename.replace('.json', '.local.js');
    }

    #extractSegmentFilename(segment: Segment): string
    {
        const filename = segment.filename.split('/').pop();

        if (filename === undefined)
        {
            throw new InvalidSegmentFilename(segment.filename);
        }

        return filename;
    }

    async #buildApplicationCache(applicationModules: ApplicationModule[]): Promise<void[]>
    {
        const promises = applicationModules.map(async (module) => this.#buildApplicationModuleCache(module));

        return Promise.all(promises);
    }

    async #buildApplicationModuleCache(module: ApplicationModule): Promise<void>
    {
        return this.#buildApplicationShareables(module);
    }

    async #buildApplicationShareables(module: ApplicationModule): Promise<void>
    {
        // Applications use class objects as shareables to share data between segments.
        // In order to make make this work we need to append their source (file) to the
        // class definition so that they can be (de)serialized.

        if (module.hasClasses() === false)
        {
            return;
        }

        const filename = module.filename;
        const file = await this.#sourceManager.load(filename);
        const code = file.content.toString();

        const sourcedCode = SourceAppender.append(module, code, filename);

        return this.#cacheManager.store(filename, sourcedCode);
    }
}
