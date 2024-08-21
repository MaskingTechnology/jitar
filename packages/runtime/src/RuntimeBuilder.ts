
import { Serializer, SerializerBuilder } from '@jitar/serialization';

import { ServerError } from './errors';
import { ExecutionManager } from './execution';
import { RemoteRepository, LocalRepository, RemoteGateway, LocalGateway, RemoteWorker, LocalWorker, Proxy, Remote } from './services';
import { HealthManager } from './health';
import { MiddlewareManager } from './middleware';
import { SourceManager, ClassModuleLoader } from './source';

export class RuntimeNotBuilt extends ServerError
{
    constructor(reason: string)
    {
        super(`Building the runtime failed: ${reason}`);
    }
}

export default class RuntimeBuilder
{
    #url: string;
    #sourceManager: SourceManager;

    #segmentNames: Set<string> = new Set();
    #healthCheckFilenames: Set<string> = new Set();
    #middlewareFilenames: Set<string> = new Set();
    #assets: Set<string> = new Set();

    #repositoryUrl?: string;
    #gatewayUrl?: string;
    #workerUrl?: string;

    constructor(url: string, sourceManager: SourceManager)
    {
        this.#url = url;
        this.#sourceManager = sourceManager;
    }

    segment(...names: string[]): this
    {
        names.forEach(name => this.#segmentNames.add(name));

        return this;
    }

    healthCheck(...filenames: string[]): this
    {
        filenames.forEach(filename => this.#healthCheckFilenames.add(filename));

        return this;
    }

    middleware(...filenames: string[]): this
    {
        filenames.forEach(filename => this.#middlewareFilenames.add(filename));

        return this;
    }

    asset(...patterns: string[]): this
    {
        patterns.forEach(pattern => this.#assets.add(pattern));

        return this;
    }

    repository(url?: string): this
    {
        this.#repositoryUrl = url;

        return this;
    }

    gateway(url?: string): this
    {
        this.#gatewayUrl = url;

        return this;
    }

    worker(url?: string): this
    {
        this.#workerUrl = url;

        return this;
    }

    buildRepository(): LocalRepository
    {
        return new LocalRepository({
            url: this.#url,
            sourceManager: this.#sourceManager,
            assets: this.#assets
        });
    }

    buildGateway(trustKey?: string): LocalGateway
    {
        return new LocalGateway({
            url: this.#url,
            trustKey,
            healthManager: this.#buildHealthManager(),
            middlewareManager: this.#buildMiddlewareManager()
        });
    }

    buildWorker(trustKey?: string): LocalWorker
    {
        return new LocalWorker({
            url: this.#url,
            trustKey,
            gateway: this.#buildRemoteGateway(),
            healthManager: this.#buildHealthManager(),
            middlewareManager: this.#buildMiddlewareManager(),
            executionManager: this.#buildExecutionManager()
        });
    }

    buildProxy(): Proxy
    {
        return new Proxy({
            url: this.#url,
            repository: this.#buildRemoteRepository(),
            runner: this.#buildRemoteGateway() ?? this.#buildRemoteWorker()
        });
    }

    #buildHealthManager(): HealthManager
    {
        const manager = new HealthManager(this.#sourceManager);

        // TODO: Load health checks from filenames

        return manager;
    }

    #buildMiddlewareManager(): MiddlewareManager
    {
        const manager = new MiddlewareManager(this.#sourceManager);

        // TODO: Load middleware from filenames

        return manager;
    }

    #buildExecutionManager(): ExecutionManager
    {
        const manager = new ExecutionManager(this.#sourceManager);

        // TODO: Load segments from names

        return manager;
    }

    #buildRemoteGateway(): RemoteGateway | undefined
    {
        if (this.#gatewayUrl === undefined)
        {
            return undefined;
        }

        return new RemoteGateway({
            url: this.#gatewayUrl,
            remote: this.#buildRemote(this.#gatewayUrl)
        });
    }

    #buildRemoteWorker(): RemoteWorker
    {
        if (this.#workerUrl === undefined)
        {
            throw new RuntimeNotBuilt('Worker URL is required');
        }

        return new RemoteWorker({
            url: this.#workerUrl,
            procedureNames: new Set(),
            remote: this.#buildRemote(this.#workerUrl)
        });
    }

    #buildRemoteRepository(): RemoteRepository
    {
        if (this.#repositoryUrl === undefined)
        {
            throw new RuntimeNotBuilt('Repository URL is required');
        }

        return new RemoteRepository({
            url: this.#repositoryUrl,
            remote: this.#buildRemote(this.#repositoryUrl)
        });
    }

    #buildRemote(url: string): Remote
    {
        const serializer = this.#buildSerializer();

        return new Remote(url, serializer);
    }

    #buildSerializer(): Serializer
    {
        const classLoader = new ClassModuleLoader(this.#sourceManager);

        return SerializerBuilder.build(classLoader);
    }
}
