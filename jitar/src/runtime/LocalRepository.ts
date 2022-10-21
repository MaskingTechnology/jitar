
import Module from '../core/types/Module.js';

import FileManager from './interfaces/FileManager.js';
import LocalNode from './LocalNode.js';
import File from './models/File.js';
import Repository from './Repository.js';
import ModuleLoader from './utils/ModuleLoader.js';

import ClientNotFound from './errors/ClientNotFound.js';
import InvalidClientId from './errors/InvalidClientId.js';
import InvalidSegmentFile from './errors/InvalidSegmentFile.js';

import { setRuntime } from '../hooks.js';

let lastClientId = 0;

const CLIENT_ID_PREFIX = 'CLIENT_';

export default class LocalRepository extends Repository
{
    #fileManager: FileManager;
    #segments: Map<string, string> = new Map();
    #clients: Map<string, string[]> = new Map();

    constructor(fileManager: FileManager, url?: string)
    {
        super(url);

        this.#fileManager = fileManager;
    }

    async loadSegment(name: string): Promise<void>
    {
        const filename = `./${name}.segment.repository.js`;
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
        const clientId = `${CLIENT_ID_PREFIX}${lastClientId++}`;

        this.#clients.set(clientId, segmentFilenames);

        return clientId;
    }

    async setRuntime(runtime: LocalNode): Promise<void>
    {
        setRuntime(runtime);
    }

    async loadAsset(filename: string): Promise<File>
    {
        return this.#fileManager.load(filename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getModuleLocation(clientId: string): Promise<string>
    {
        return this.#fileManager.getRootLocation();
    }

    async loadModule(clientId: string, filename: string): Promise<File>
    {
        this.#validateClientId(clientId);

        const segmentFilename = this.#segments.get(filename);

        if (segmentFilename === undefined)
        {
            return this.#getNodeModule(filename, false);
        }

        return this.#hasClientSegmentFile(clientId, segmentFilename)
            ? this.#getNodeModule(filename, true)
            : this.#getRemoteModule(filename);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async importModule(clientId: string, filename: string): Promise<Module>
    {
        // This function loads the original module file containing the
        // original imports to prevent import issues while loading the
        // module in the local repository.

        const location = this.#fileManager.getAbsoluteLocation(filename);

        return ModuleLoader.import(location);
    }

    #validateClientId(clientId: string): void
    {
        if (clientId.startsWith(CLIENT_ID_PREFIX) === false)
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

    async #getNodeModule(filename: string, isSegmented: boolean): Promise<File>
    {
        // This function loads the node module file containing the rewritten
        // imports to prevent import issues while loading the module from
        // a remote repository.

        if (isSegmented)
        {
            filename = filename.replace('.js', '.local.js');
        }

        const file = await this.loadAsset(filename);
        const code = file.content.toString();

        return new File(filename, 'application/javascript', code);
    }

    async #getRemoteModule(filename: string): Promise<File>
    {
        // This function loads the remote module file containing the rewritten
        // implementation for each function to execute them on another node.

        const remoteFilename = filename.replace('.js', '.remote.js');

        return this.loadAsset(remoteFilename);
    }
}
