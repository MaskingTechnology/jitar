
import FileNotFound from '../errors/FileNotFound.js';
import InvalidSegmentFile from '../errors/InvalidSegmentFile.js';

import FileManager from '../interfaces/FileManager.js';
import File from '../models/File.js';
import Module from '../types/Module.js';
import FileHelper from '../utils/FileHelper.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Repository from './Repository.js';

export default class LocalRepository extends Repository
{
    #fileManager: FileManager;
    #segments: Map<string, string[]> = new Map();

    #segmentNames: Set<string> = new Set();
    #assets: Set<string> = new Set();
    #overrides: Map<string, string> = new Map();

    constructor(fileManager: FileManager, url?: string)
    {
        super(url);

        this.#fileManager = fileManager;

        ModuleLoader.setBaseUrl(fileManager.getRootLocation());
    }

    set segmentNames(names: Set<string>)
    {
        this.#segmentNames = new Set(names);
    }

    set assets(patterns: Set<string>)
    {
        this.#assets = patterns;
    }

    set overrides(overrides: Map<string, string>)
    {
        this.#overrides = overrides;
    }

    async start(): Promise<void>
    {
        await super.start();

        await this.#loadSegments();

        this.#translateOverrides();
    }

    stop(): Promise<void>
    {
        this.#unloadSegments();

        return super.stop();
    }

    async #loadSegments(): Promise<void>
    {
        for (const name of this.#segmentNames)
        {
            await this.#loadSegment(name);
        }
    }

    async #loadSegment(name: string): Promise<void>
    {
        const relativeFilename = FileHelper.createRepositoryFilename(name);
        const absoluteFilename = this.#fileManager.getAbsoluteLocation(relativeFilename);

        const module = await ModuleLoader.load(absoluteFilename);
        const files = module.files as string[];

        if (files === undefined)
        {
            throw new InvalidSegmentFile(absoluteFilename);
        }

        this.registerSegment(name, files);
    }

    #unloadSegments(): void
    {
        this.#segments.clear();
    }

    async registerSegment(name: string, filenames: string[]): Promise<void>
    {
        this.#segments.set(name, filenames);
    }

    #translateOverrides(): void
    {
        const translated = new Map<string, string>();

        for (const [targetName, destinationName] of this.#overrides)
        {
            const relativeTargetFilename = FileHelper.assureRelativeFilenameWithExtension(targetName);
            const relativeDestinationFilename = FileHelper.assureRelativeFilenameWithExtension(destinationName);

            const absoluteTargetFilename = this.#fileManager.getAbsoluteLocation(relativeTargetFilename);
            const absoluteDestinationFilename = this.#fileManager.getAbsoluteLocation(relativeDestinationFilename);

            translated.set(absoluteTargetFilename, absoluteDestinationFilename);
        }

        this.#overrides = translated;
    }

    readAsset(filename: string): Promise<File>
    {
        if (this.#assets.has(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        return this.#readFile(filename);
    }

    async readModule(specifier: string): Promise<File>
    {
        const filename = this.#getModuleFilename(specifier);
        const file = await this.#readFile(filename);
        const code = file.content.toString();

        return new File(filename, 'application/javascript', code);
    }

    loadModule(specifier: string): Promise<Module>
    {
        const filename = this.#getModuleFilename(specifier);

        return ModuleLoader.load(filename);
    }

    #getModuleFilename(filename: string): string
    {
        const relativeFilename = FileHelper.assureRelativeFilenameWithExtension(filename);
        const absoluteFilename = this.#fileManager.getAbsoluteLocation(relativeFilename);

        if (FileHelper.isSegmentFilename(absoluteFilename))
        {
            return absoluteFilename;
        }

        const assignedFilename = this.#getAssignedFilename(absoluteFilename);

        return FileHelper.convertToLocalFilename(assignedFilename);
    }

    #getAssignedFilename(filename: string): string
    {
        return this.#overrides.get(filename) ?? filename;
    }

    #readFile(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }
}
