
import { createRepositoryFilename, convertToLocalFilename, convertToRemoteFilename, isSegmentFilename } from '../definitions/Files.js';

import FileNotFound from '../errors/FileNotFound.js';
import InvalidSegmentFile from '../errors/InvalidSegmentFile.js';

import FileManager from '../interfaces/FileManager.js';
import File from '../models/File.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Repository from './Repository.js';

export default class LocalRepository extends Repository
{
    // All filenames used here are relative to the root location.

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
        const relativeFilename = `./${createRepositoryFilename(name)}`;
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
            const relativeTargetFilename = ModuleLoader.assureExtension(targetName);
            const relativeDestinationFilename = ModuleLoader.assureExtension(destinationName);

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

    readModule(source: string, specifier: string): Promise<File>
    {
        if (isSegmentFilename(specifier))
        {
            return this.#readWorkerModule(specifier); 
        }

        if (this.#isSegmented(specifier) === false)
        {
            return this.#readWorkerModule(specifier);
        }

        return this.#bbb(source, specifier)
            ? this.#readWorkerModule(specifier)
            : this.#readRemoteModule(specifier);
    }

    loadModule(specifier: string): Promise<Module>
    {
        const filename = this.#getModuleFilename(specifier);

        return ModuleLoader.load(filename);
    }

    #bbb(source: string, specifier: string): boolean
    {
        const sourceSegments = this.#aaa(source);
        const specifierSegments = this.#aaa(specifier);

        return sourceSegments.some(segmentName => specifierSegments.includes(segmentName));
    }

    async #readWorkerModule(name: string): Promise<File>
    {
        const filename = this.#getModuleFilename(name);
        const file = await this.#readFile(filename);
        const code = file.content.toString();

        return new File(filename, 'application/javascript', code);
    }

    #readRemoteModule(name: string): Promise<File>
    {
        const remoteFilename = convertToRemoteFilename(name);

        return this.#readFile(remoteFilename);
    }

    #getModuleFilename(name: string): string
    {
        const relativeFilename = ModuleLoader.assureExtension(name);
        const absoluteFilename = this.#fileManager.getAbsoluteLocation(relativeFilename);

        if (isSegmentFilename(absoluteFilename))
        {
            return absoluteFilename;
        }

        const assignedFilename = this.#getAssignedFilename(absoluteFilename);

        return convertToLocalFilename(assignedFilename);
    }

    #getAssignedFilename(filename: string): string
    {
        return this.#overrides.get(filename) ?? filename;
    }

    #readFile(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }

    #aaa(filename: string): string[]
    {
        const segmentNames = [...this.#segments.keys()];

        return segmentNames.filter(segmentName =>
        {
            const filenames = this.#segments.get(segmentName) ?? [];

            return filenames.includes(filename);
        });
    }

    #isSegmented(filename: string): boolean
    {
        const segmentNames = [...this.#segments.keys()];

        return segmentNames.some(segmentName =>
        {
            const filenames = this.#segments.get(segmentName) ?? [];

            return filenames.includes(filename);
        });
    }
}
