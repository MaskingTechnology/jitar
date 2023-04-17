
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
    #fileManager: FileManager;
    #segments: Map<string, string> = new Map();
    #clients: Map<string, string[]> = new Map();
    #assets: string[];

    constructor(fileManager: FileManager, assets: string[], url?: string)
    {
        super(url);

        this.#fileManager = fileManager;
        this.#assets = assets;
    }

    async loadSegment(name: string): Promise<void>
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

    async registerSegment(name: string, files: string[]): Promise<void>
    {
        files.forEach((file: string) => this.#segments.set(file, name));
    }

    async registerClient(segmentFilenames: string[]): Promise<string>
    {
        const clientId = clientIdHelper.generate();

        this.#clients.set(clientId, segmentFilenames);

        return clientId;
    }

    loadAsset(filename: string): Promise<File>
    {
        if (this.#assets.includes(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        return this.#readFile(filename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getModuleLocation(clientId: string): Promise<string>
    {
        return this.#fileManager.getRootLocation();
    }

    loadModule(clientId: string, filename: string): Promise<File>
    {
        this.#validateClientId(clientId);

        const segmentFilename = this.#segments.get(filename);

        if (segmentFilename === undefined)
        {
            return this.#getNodeModule(filename);
        }

        return this.#hasClientSegmentFile(clientId, segmentFilename)
            ? this.#getNodeModule(filename)
            : this.#getRemoteModule(filename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    importModule(clientId: string, filename: string): Promise<Module>
    {
        // This function loads the original module file containing the
        // original imports to prevent import issues while loading the
        // module in the local repository.

        filename = ModuleLoader.assureExtension(filename);

        const location = this.#fileManager.getAbsoluteLocation(filename);

        return ModuleLoader.import(location);
    }

    #validateClientId(clientId: string): void
    {
        if (clientIdHelper.validate(clientId) === false)
        {
            throw new InvalidClientId(clientId);
        }

        if (this.#clients.has(clientId) === false)
        {
            throw new ClientNotFound(clientId);
        }
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

    async #getNodeModule(filename: string): Promise<File>
    {
        // This function loads the node module file containing the rewritten
        // imports to prevent import issues while loading the module from
        // a remote repository.

        const localFilename = isSegmentFilename(filename) ? filename : convertToLocalFilename(filename);
        const file = await this.#readFile(localFilename);
        const code = file.content.toString();

        return new File(filename, 'application/javascript', code);
    }

    #getRemoteModule(filename: string): Promise<File>
    {
        // This function loads the remote module file containing the rewritten
        // implementation for each function to execute them on another node.

        const remoteFilename = convertToRemoteFilename(filename);

        return this.#readFile(remoteFilename);
    }

    #readFile(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }
}
