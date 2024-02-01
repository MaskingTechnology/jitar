
import RuntimeNotBuilt from './errors/RuntimeNotBuilt.js';

import FileManager from './interfaces/FileManager.js';

import RemoteRepository from './services/RemoteRepository.js';
import LocalRepository from './services/LocalRepository.js';

import RemoteGateway from './services/RemoteGateway.js';
import LocalGateway from './services/LocalGateway.js';

import RemoteWorker from './services/RemoteWorker.js';
import LocalWorker from './services/LocalWorker.js';

import Proxy from './services/Proxy.js';
import Standalone from './services/Standalone.js';

export default class RuntimeBuilder
{
    #url?: string;
    #fileManager?: FileManager;
    #segments: Set<string> = new Set();
    #healthChecks: Set<string> = new Set();
    #middlewares: Set<string> = new Set();
    #assets: Set<string> = new Set();
    #overrides: Map<string, string> = new Map();

    #repository?: RemoteRepository;
    #gateway?: RemoteGateway;
    #worker?: RemoteWorker;

    url(url?: string): this
    {
        this.#url = url;

        return this;
    }

    fileManager(fileManager: FileManager): this
    {
        this.#fileManager = fileManager;

        return this;
    }

    segment(...names: string[]): this
    {
        names.forEach(name => this.#segments.add(name));

        return this;
    }

    healthCheck(...filenames: string[]): this
    {
        filenames.forEach(filename => this.#healthChecks.add(filename));

        return this;
    }

    middleware(...filenames: string[]): this
    {
        filenames.forEach(filename => this.#middlewares.add(filename));

        return this;
    }

    asset(...patterns: string[]): this
    {
        patterns.forEach(pattern => this.#assets.add(pattern));

        return this;
    }

    override(...mappings: Record<string, string>[]): this
    {
        for (const map of mappings)
        {
            for (const [key, value] of Object.entries(map))
            {
                this.#overrides.set(key, value);
            }
        }

        return this;
    }

    repository(url?: string): this
    {
        this.#repository = url !== undefined ? new RemoteRepository(url) : undefined;

        return this;
    }

    gateway(url?: string): this
    {
        this.#gateway = url !== undefined ? new RemoteGateway(url) : undefined;

        return this;
    }

    worker(url?: string): this
    {
        this.#worker = url !== undefined ? new RemoteWorker(url) : undefined;

        return this;
    }

    buildRepository(): LocalRepository
    {
        if (this.#fileManager === undefined)
        {
            throw new RuntimeNotBuilt('File manager is not set for the repository');
        }

        const repository = new LocalRepository(this.#fileManager, this.#url);
        repository.healthCheckFiles = this.#healthChecks;
        repository.segmentNames = this.#segments;
        repository.assets = this.#assets;
        repository.overrides = this.#overrides;

        return repository;
    }

    buildGateway(trustKey?: string): LocalGateway
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the gateway');
        }

        const gateway = new LocalGateway(this.#repository, this.#url, trustKey);
        gateway.healthCheckFiles = this.#healthChecks;
        gateway.middlewareFiles = this.#middlewares;

        return gateway;
    }

    buildWorker(trustKey?: string): LocalWorker
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the worker');
        }
        
        const worker = new LocalWorker(this.#repository, this.#gateway, this.#url, trustKey);
        worker.segmentNames = this.#segments;
        worker.healthCheckFiles = this.#healthChecks;
        worker.middlewareFiles = this.#middlewares;

        this.#repository.segmentNames = this.#segments;

        if (this.gateway !== undefined)
        {
            (this.#gateway as RemoteGateway).worker = worker;
        }
        
        return worker;
    }

    buildProxy(): Proxy
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the proxy');
        }

        const runner = this.#gateway ?? this.#worker;

        if (runner === undefined)
        {
            throw new RuntimeNotBuilt('Runner (gateway or worker) is not set for the proxy');
        }

        const proxy = new Proxy(this.#repository, runner, this.#url);
        proxy.healthCheckFiles = this.#healthChecks;
        proxy.middlewareFiles = this.#middlewares;

        return proxy;
    }

    buildStandalone(trustKey?: string): Standalone
    {
        if (this.#fileManager === undefined)
        {
            throw new RuntimeNotBuilt('File manager is not set for the standalone');
        }

        const repository = new LocalRepository(this.#fileManager, this.#url);
        repository.segmentNames = this.#segments;
        repository.assets = this.#assets;
        repository.overrides = this.#overrides;

        const worker = new LocalWorker(repository, this.#gateway, this.#url, trustKey);
        worker.segmentNames = this.#segments;

        const standalone = new Standalone(repository, worker, this.#url);
        standalone.healthCheckFiles = this.#healthChecks;
        standalone.middlewareFiles = this.#middlewares;

        return standalone;
    }
}
