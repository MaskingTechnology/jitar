
import { GatewayConfiguration, ProxyConfiguration, RepositoryConfiguration, ServerConfiguration, StandaloneConfiguration, WorkerConfiguration } from '@jitar/configuration';
import { ExecutionManager } from '@jitar/execution';
import { HealthManager } from '@jitar/health';
import { Logger, LogLevel } from '@jitar/logging';
import { MiddlewareManager } from '@jitar/middleware';
import { DummyProvider, DummyRunner, LocalGateway, LocalRepository, LocalWorker, LocalProxy, RemoteBuilder, RemoteGateway, RemoteRepository } from '@jitar/services';
import { SourcingManager } from '@jitar/sourcing';

import UnknownServiceConfigured from './errors/UnknownServiceConfigured';
import ResourceManager from './ResourceManager';
import Server from './Server';

export default class RuntimeBuilder
{
    readonly #sourcingManager: SourcingManager;
    readonly  #remoteBuilder: RemoteBuilder;

    constructor(sourcingManager: SourcingManager, remoteBuilder: RemoteBuilder)
    {
        this.#sourcingManager = sourcingManager;
        this.#remoteBuilder = remoteBuilder;
    }

    async build(configuration: ServerConfiguration, logLevel?: LogLevel): Promise<Server>
    {
        const setUp = configuration.setUp;
        const tearDown = configuration.tearDown;
        const middleware = configuration.middleware;
        const healthChecks = configuration.healthChecks;

        const healthManager = this.#buildHealthManager(healthChecks);
        const proxy = await this.#buildService(configuration, healthManager);
        const sourcingManager = this.#sourcingManager;
        const remoteBuilder = this.#remoteBuilder;
        const resourceManager = this.#buildResourceManager(setUp, tearDown);
        const middlewareManager = this.#buildMiddlewareManager(middleware);
        

        const logger = new Logger(logLevel);

        return new Server({ proxy, sourcingManager, remoteBuilder, resourceManager, middlewareManager, logger });
    }

    #buildService(configuration: ServerConfiguration, healthManager: HealthManager): Promise<LocalProxy>
    {
        if (configuration.gateway !== undefined) return this.#buildGatewayProxy(configuration.url, configuration.gateway, healthManager);
        if (configuration.worker !== undefined) return this.#buildWorkerProxy(configuration.url, configuration.worker, healthManager);
        if (configuration.repository !== undefined) return this.#buildRepositoryProxy(configuration.url, configuration.repository, healthManager);
        if (configuration.proxy !== undefined) return this.#buildProxy(configuration.url, configuration.proxy);
        if (configuration.standalone !== undefined) return this.#buildStandalone(configuration.url, configuration.standalone, healthManager);

        throw new UnknownServiceConfigured();
    }

    async #buildGatewayProxy(url: string, configuration: GatewayConfiguration, healthManager: HealthManager): Promise<LocalProxy>
    {
        const provider = new DummyProvider();
        const runner = this.#buildLocalGateway(url, configuration, healthManager);

        return new LocalProxy({ url, provider, runner });
    }

    async #buildWorkerProxy(url: string, configuration: WorkerConfiguration, healthManager: HealthManager): Promise<LocalProxy>
    {
        const provider = new DummyProvider();
        const runner = this.#buildLocalWorker(url, configuration, healthManager);

        return new LocalProxy({ url, provider, runner });
    }

    async #buildRepositoryProxy(url: string, configuration: RepositoryConfiguration, healthManager: HealthManager): Promise<LocalProxy>
    {
        const provider = await this.#buildLocalRepository(url, configuration, healthManager);
        const runner = new DummyRunner();

        return new LocalProxy({ url, provider, runner });
    }

    #buildLocalGateway(url: string, configuration: GatewayConfiguration, healthManager: HealthManager): LocalGateway
    {
        const trustKey = configuration.trustKey;
        const monitorInterval = configuration.monitor;

        return new LocalGateway({ url, trustKey, monitorInterval, healthManager });
    }

    #buildRemoteGateway(url: string): RemoteGateway
    {
        const remote = this.#remoteBuilder.build(url);

        return new RemoteGateway({ url, remote });
    }

    #buildLocalWorker(url: string, configuration: WorkerConfiguration, healthManager: HealthManager): LocalWorker
    {
        const trustKey = configuration.trustKey;
        const gateway = configuration.gateway ? this.#buildRemoteGateway(configuration.gateway) : undefined;
        const registerAtGateway = gateway !== undefined; // if we have a gateway, the worker needs to register itself at it.
        const executionManager = this.#buildExecutionManager(configuration.segments);

        return new LocalWorker({ url, trustKey, gateway, registerAtGateway, executionManager, healthManager });
    }

    async #buildLocalRepository(url: string, configuration: RepositoryConfiguration, healthManager: HealthManager): Promise<LocalRepository>
    {
        const sourcingManager = this.#sourcingManager;
        const assets = await this.#buildAssetSet(configuration.assets);
        const indexFilename = configuration.indexFilename;
        const serveIndexOnNotFound = configuration.serveIndexOnNotFound;

        return new LocalRepository({ url, sourcingManager, assets, indexFilename, serveIndexOnNotFound, healthManager });
    }

    #buildRemoteRepository(url: string): RemoteRepository
    {
        const remote = this.#remoteBuilder.build(url);

        return new RemoteRepository({ url, remote });
    }

    async #buildProxy(url: string, configuration: ProxyConfiguration): Promise<LocalProxy>
    {
        const provider = this.#buildRemoteRepository(configuration.repository);
        const runner = this.#buildRemoteGateway(configuration.gateway);

        return new LocalProxy({ url, provider, runner });
    }

    async #buildStandalone(url: string, configuration: StandaloneConfiguration, healthManager: HealthManager): Promise<LocalProxy>
    {
        const provider = await this.#buildLocalRepository(url, configuration, healthManager);
        const runner = this.#buildLocalWorker(url, configuration, healthManager);

        return new LocalProxy({ url, provider, runner });
    }

    #buildResourceManager(setUp: string[] = [], tearDown: string[] = []): ResourceManager
    {
        const translatedSetUp = setUp.map(filename => this.#assureExtension(filename));
        const translatedTearDown = tearDown.map(filename => this.#assureExtension(filename));

        return new ResourceManager(this.#sourcingManager, translatedSetUp, translatedTearDown);
    }

    #buildHealthManager(filenames: string[] = []): HealthManager
    {
        const translatedFilenames = filenames.map(filename => this.#assureExtension(filename));

        return new HealthManager(this.#sourcingManager, translatedFilenames);
    }

    #buildMiddlewareManager(filenames: string[] = []): MiddlewareManager
    {
        const translatedFilenames = filenames.map(filename => this.#assureExtension(filename));

        return new MiddlewareManager(this.#sourcingManager, translatedFilenames);
    }

    #buildExecutionManager(segmentNames: string[] = []): ExecutionManager
    {
        const filenames = segmentNames.map(name => `./${name}.segment.js`);

        return new ExecutionManager(this.#sourcingManager, filenames);
    }

    async #buildAssetSet(patterns?: string[]): Promise<Set<string>>
    {
        if (patterns === undefined) return new Set();

        const filenames = await this.#sourcingManager.filter(...patterns);

        return new Set(filenames);
    }

    #assureExtension(filename: string): string
    {
        return filename.endsWith('.js')
            ? filename 
            : filename + '.js';
    }
}
