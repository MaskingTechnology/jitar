
import RuntimeNotBuilt from './errors/RuntimeNotBuilt.js';

import FileManager from './interfaces/FileManager.js';

import RemoteRepository from './services/RemoteRepository.js';
import LocalRepository from './services/LocalRepository.js';

import RemoteGateway from './services/RemoteGateway.js';
import LocalGateway from './services/LocalGateway.js';

import RemoteNode from './services/RemoteNode.js';
import LocalNode from './services/LocalNode.js';

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
    #node?: RemoteNode;

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

    node(url?: string): this
    {
        this.#node = url !== undefined ? new RemoteNode(url) : undefined;

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

    buildGateway(secret?: string): LocalGateway
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the gateway');
        }

        console.log('buildGateway', this.#repository, this.#url, secret);

        const gateway = new LocalGateway(this.#repository, this.#url, secret);
        gateway.healthCheckFiles = this.#healthChecks;
        gateway.middlewareFiles = this.#middlewares;

        return gateway;
    }

    buildNode(): LocalNode
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the node');
        }
        
        const node = new LocalNode(this.#repository, this.#gateway, this.#url);
        node.segmentNames = this.#segments;
        node.healthCheckFiles = this.#healthChecks;
        node.middlewareFiles = this.#middlewares;

        this.#repository.segmentNames = this.#segments;

        if (this.gateway !== undefined)
        {
            (this.#gateway as RemoteGateway).node = node;
        }
        
        return node;
    }

    buildProxy(): Proxy
    {
        if (this.#repository === undefined)
        {
            throw new RuntimeNotBuilt('Repository is not set for the proxy');
        }

        const runner = this.#gateway ?? this.#node;

        if (runner === undefined)
        {
            throw new RuntimeNotBuilt('Runner (gateway or node) is not set for the proxy');
        }

        const proxy = new Proxy(this.#repository, runner, this.#url);
        proxy.healthCheckFiles = this.#healthChecks;
        proxy.middlewareFiles = this.#middlewares;

        return proxy;
    }

    buildStandalone(): Standalone
    {
        if (this.#fileManager === undefined)
        {
            throw new RuntimeNotBuilt('File manager is not set for the standalone');
        }

        const repository = new LocalRepository(this.#fileManager, this.#url);
        repository.segmentNames = this.#segments;
        repository.assets = this.#assets;
        repository.overrides = this.#overrides;

        const node = new LocalNode(repository, this.#gateway, this.#url);
        node.segmentNames = this.#segments;

        const standalone = new Standalone(repository, node, this.#url);
        standalone.healthCheckFiles = this.#healthChecks;
        standalone.middlewareFiles = this.#middlewares;

        return standalone;
    }
}
