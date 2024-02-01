
import { createRepositoryFilename, convertToLocalFilename, convertToRemoteFilename, isSegmentFilename } from '../definitions/Files.js';

import ClientNotFound from '../errors/ClientNotFound.js';
import FileNotFound from '../errors/FileNotFound.js';
import InvalidClientId from '../errors/InvalidClientId.js';
import InvalidSegmentFile from '../errors/InvalidSegmentFile.js';

import FileManager from '../interfaces/FileManager.js';
import File from '../models/File.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';
import ClientIdHelper from '../utils/ClientIdHelper.js';

import Repository from './Repository.js';

const clientIdHelper = new ClientIdHelper();

export default class LocalRepository extends Repository
{
    // All filenames used here are relative to the root location.

    #fileManager: FileManager;
    #segments: Map<string, string> = new Map();
    #clients: Map<string, string[]> = new Map();

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
        this.#unregisterClients();
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
        filenames.forEach((filename: string) => this.#segments.set(filename, name));
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

    async registerClient(segmentFilenames: string[]): Promise<string>
    {
        const clientId = clientIdHelper.generate();

        this.#clients.set(clientId, segmentFilenames);

        return clientId;
    }

    #unregisterClients(): void
    {
        this.#clients.clear();
    }

    readAsset(filename: string): Promise<File>
    {
        if (this.#assets.has(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        return this.#readFile(filename);
    }

    readModule(name: string, clientId: string): Promise<File>
    {
        clientId = this.#validateClientId(clientId);

        const segmentFilename = this.#segments.get(name);

        if (segmentFilename === undefined)
        {
            return this.#readWorkerModule(name);
        }

        return this.#hasClientSegmentFile(clientId, segmentFilename)
            ? this.#readWorkerModule(name)
            : this.#readRemoteModule(name);
    }

    loadModule(name: string): Promise<Module>
    {
        const filename = this.#getModuleFilename(name);

        return ModuleLoader.load(filename);
    }

    #validateClientId(clientId: string): string
    {
        if (clientIdHelper.validate(clientId) === false)
        {
            throw new InvalidClientId(clientId);
        }

        if (this.#clients.has(clientId) === false)
        {
            throw new ClientNotFound(clientId);
        }

        return clientId;
    }

    #hasClientSegmentFile(clientId: string, segmentFilename: string): boolean
    {
        const clientSegmentFiles = this.#clients.get(clientId);

        if (clientSegmentFiles === undefined)
        {
            throw new ClientNotFound(clientId);
        }

        return clientSegmentFiles.some(clientSegmentFilename => segmentFilename.endsWith(clientSegmentFilename));
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
}
