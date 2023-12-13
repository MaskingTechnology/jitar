
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

    #segmentNames: string[];
    #assets: string[];
    #overrides: Map<string, string>;

    constructor(fileManager: FileManager, segmentNames: string[], assets: string[], overrides: Map<string, string>, url?: string)
    {
        super(url);

        this.#fileManager = fileManager;
        this.#segmentNames = segmentNames;
        this.#assets = assets;
        this.#overrides = overrides;

        ModuleLoader.setBaseUrl(fileManager.getRootLocation());
    }

    start(): Promise<void>
    {
        return this.#loadSegments();
    }

    async stop(): Promise<void>
    {
        this.#unregisterClients();
        this.#unloadSegments();
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
        const filename = `./${createRepositoryFilename(name)}`;
        const location = this.#fileManager.getAbsoluteLocation(filename);
        const module = await ModuleLoader.load(location);
        const files = module.files as string[];

        if (files === undefined)
        {
            throw new InvalidSegmentFile(location);
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
        if (this.#assets.includes(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        //filename = this.#getAssignedFilename(filename);

        return this.#readFile(filename);
    }

    readModule(name: string, clientId: string): Promise<File>
    {
        clientId = this.#validateClientId(clientId);

        const segmentFilename = this.#segments.get(name);

        if (segmentFilename === undefined)
        {
            return this.#readNodeModule(name);
        }

        return this.#hasClientSegmentFile(clientId, segmentFilename)
            ? this.#readNodeModule(name)
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

    async #readNodeModule(name: string): Promise<File>
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
        let filename = ModuleLoader.assureExtension(name);

        if (isSegmentFilename(filename) === false)
        {
            filename = convertToLocalFilename(filename);
        }

        return this.#fileManager.getAbsoluteLocation(filename);

        // const override = this.#overrides.get(filename);

        // return override !== undefined ? override : filename;
    }

    #readFile(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }
}
