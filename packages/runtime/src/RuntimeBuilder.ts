
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

    async buildRepository(): Promise<LocalRepository>
    {
        const url = this.#url;
        const sourceManager = this.#sourceManager;
        const assets = this.#assets;

        return new LocalRepository({ url, sourceManager, assets });
    }

    async buildGateway(trustKey?: string): Promise<LocalGateway>
    {
        const url = this.#url;
        const healthManager = await this.#buildHealthManager();
        const middlewareManager = await this.#buildMiddlewareManager();

        return new LocalGateway({ url, trustKey, healthManager, middlewareManager });
    }

    async buildWorker(trustKey?: string): Promise<LocalWorker>
    {
        const url = this.#url;
        const gateway = this.#buildRemoteGateway();
        const healthManager = await this.#buildHealthManager();
        const middlewareManager = await this.#buildMiddlewareManager();
        const executionManager = await this.#buildExecutionManager();

        return new LocalWorker({ url, trustKey, gateway, healthManager, middlewareManager, executionManager });
    }

    async buildProxy(): Promise<Proxy>
    {
        const url = this.#url;
        const repository = this.#buildRemoteRepository();
        const runner = this.#buildRemoteGateway() ?? this.#buildRemoteWorker();

        return new Proxy({ url, repository, runner });
    }

    async #buildHealthManager(): Promise<HealthManager>
    {
        const manager = new HealthManager(this.#sourceManager);

        const filenames = [...this.#healthCheckFilenames.values()];

        await Promise.all(filenames.map(filename => manager.importHealthCheck(filename)));

        return manager;
    }

    async #buildMiddlewareManager(): Promise<MiddlewareManager>
    {
        const manager = new MiddlewareManager(this.#sourceManager);

        const filenames = [...this.#middlewareFilenames.values()];

        await Promise.all(filenames.map(filename => manager.importMiddleware(filename)));

        return manager;
    }

    async #buildExecutionManager(): Promise<ExecutionManager>
    {
        const manager = new ExecutionManager(this.#sourceManager);

        const segmentNames = [...this.#segmentNames.values()];
        const filenames = segmentNames.map(name => `./${name}.segment.js`);

        await Promise.all(filenames.map(filename => manager.importSegment(filename)));

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
