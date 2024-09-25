
import { ServerConfiguration, GatewayConfiguration, WorkerConfiguration, RepositoryConfiguration, ProxyConfiguration, StandaloneConfiguration } from '@jitar/configuration';
import { Segment, ExecutionManager } from '@jitar/execution';
import { HealthCheck, HealthManager } from '@jitar/health';
import { Middleware, MiddlewareManager } from '@jitar/middleware';
import { RemoteRepository, LocalRepository, RemoteGateway, LocalGateway, LocalWorker, Proxy, DummyProvider, DummyRunner, RemoteBuilder } from '@jitar/services';
import { SourcingManager } from '@jitar/sourcing';

import UnknownServiceConfigured from './errors/UnknownServiceConfigured';
import Server from './Server';

export default class RuntimeBuilder
{
    #sourcingManager: SourcingManager;
    #remoteBuilder: RemoteBuilder;

    constructor(sourcingManager: SourcingManager, remoteBuilder: RemoteBuilder)
    {
        this.#sourcingManager = sourcingManager;
        this.#remoteBuilder = remoteBuilder;
    }

    async build(configuration: ServerConfiguration): Promise<Server>
    {
        const setUp = configuration.setUp ?? [];
        const tearDown = configuration.tearDown ?? [];
        const middleware = configuration.worker?.middleware
                        ?? configuration.gateway?.middleware
                        ?? configuration.standalone?.middleware;

        const proxy = await this.#buildService(configuration);
        const sourcingManager = this.#sourcingManager;
        const remoteBuilder = this.#remoteBuilder;
        const middlewareManager = await this.#buildMiddlewareManager(middleware);
        const setUpScripts = setUp.map(filename => this.#makeSharedFilename(filename));
        const tearDownScripts = tearDown.map(filename => this.#makeSharedFilename(filename));

        return new Server({ proxy, sourcingManager, remoteBuilder, middlewareManager, setUpScripts, tearDownScripts });
    }

    #buildService(configuration: ServerConfiguration): Promise<Proxy>
    {
        if (configuration.gateway !== undefined) return this.#buildGatewayProxy(configuration.url, configuration.gateway);
        if (configuration.worker !== undefined) return this.#buildWorkerProxy(configuration.url, configuration.worker);
        if (configuration.repository !== undefined) return this.#buildRepositoryProxy(configuration.url, configuration.repository);
        if (configuration.proxy !== undefined) return this.#buildProxy(configuration.url, configuration.proxy);
        if (configuration.standalone !== undefined) return this.#buildStandalone(configuration.url, configuration.standalone);

        throw new UnknownServiceConfigured();
    }

    async #buildGatewayProxy(url: string, configuration: GatewayConfiguration): Promise<Proxy>
    {
        const provider = new DummyProvider();
        const runner = await this.#buildLocalGateway(url, configuration);

        return new Proxy({ url, provider, runner });
    }

    async #buildWorkerProxy(url: string, configuration: WorkerConfiguration): Promise<Proxy>
    {
        const provider = new DummyProvider();
        const runner = await this.#buildLocalWorker(url, configuration);

        return new Proxy({ url, provider, runner });
    }

    async #buildRepositoryProxy(url: string, configuration: RepositoryConfiguration): Promise<Proxy>
    {
        const provider = await this.#buildLocalRepository(url, configuration);
        const runner = new DummyRunner();

        return new Proxy({ url, provider, runner });
    }

    async #buildLocalGateway(url: string, configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const trustKey = configuration.trustKey;
        const healthManager = await this.#buildHealthManager(configuration.healthChecks);
        const monitorInterval = configuration.monitor;

        return new LocalGateway({ url, trustKey, healthManager, monitorInterval });
    }

    #buildRemoteGateway(url: string): RemoteGateway
    {
        const remote = this.#remoteBuilder.build(url);

        return new RemoteGateway({ url, remote });
    }

    async #buildLocalWorker(url: string, configuration: WorkerConfiguration): Promise<LocalWorker>
    {
        const trustKey = configuration.trustKey;
        const gateway = configuration.gateway ? this.#buildRemoteGateway(configuration.gateway) : undefined;
        const healthManager = await this.#buildHealthManager(configuration.healthChecks);
        const executionManager = await this.#buildExecutionManager(configuration.segments);

        return new LocalWorker({ url, trustKey, gateway, healthManager, executionManager });
    }

    async #buildLocalRepository(url: string, configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const sourcingManager = this.#sourcingManager;
        const assets = await this.#buildAssetSet(configuration.assets);
        const indexFilename = configuration.indexFilename;
        const serveIndexOnNotFound = configuration.serveIndexOnNotFound;

        return new LocalRepository({ url, sourcingManager, assets, indexFilename, serveIndexOnNotFound });
    }

    #buildRemoteRepository(url: string): RemoteRepository
    {
        const remote = this.#remoteBuilder.build(url);

        return new RemoteRepository({ url, remote });
    }

    async #buildProxy(url: string, configuration: ProxyConfiguration): Promise<Proxy>
    {
        const provider = this.#buildRemoteRepository(configuration.repository);
        const runner = this.#buildRemoteGateway(configuration.gateway);

        return new Proxy({ url, provider, runner });
    }

    async #buildStandalone(url: string, configuration: StandaloneConfiguration): Promise<Proxy>
    {
        const provider = await this.#buildLocalRepository(url, configuration);
        const runner = await this.#buildLocalWorker(url, configuration);

        return new Proxy({ url, provider, runner });
    }

    async #buildHealthManager(filenames?: string[]): Promise<HealthManager>
    {
        const manager = new HealthManager();

        if (filenames !== undefined)
        {
            const sharedFilenames = filenames.map(filename => this.#makeSharedFilename(filename));
            const modules = await Promise.all(sharedFilenames.map(filename => this.#sourcingManager.import(filename)));

            modules.forEach(module => manager.addHealthCheck(module.default as HealthCheck));
        }

        return manager;
    }

    async #buildMiddlewareManager(filenames?: string[]): Promise<MiddlewareManager>
    {
        const manager = new MiddlewareManager();

        if (filenames !== undefined)
        {
            const sharedFilenames = filenames.map(filename => this.#makeSharedFilename(filename));
            const modules = await Promise.all(sharedFilenames.map(filename => this.#sourcingManager.import(filename)));

            modules.forEach(module => manager.addMiddleware(module.default as Middleware));
        }

        return manager;
    }

    async #buildExecutionManager(segmentNames: string[]): Promise<ExecutionManager>
    {
        const manager = new ExecutionManager();
        const filenames = segmentNames.map(name => `./${name}.segment.js`);

        const modules = await Promise.all(filenames.map(filename => this.#sourcingManager.import(filename)));

        modules.forEach(module => manager.addSegment(module.default as Segment));

        return manager;
    }

    async #buildAssetSet(patterns?: string[]): Promise<Set<string>>
    {
        if (patterns === undefined) return new Set();
        
        const filenames = await this.#sourcingManager.filter(...patterns);

        return new Set(filenames);
    }

    #makeSharedFilename(filename: string): string
    {
        if (filename.endsWith('.js') === false)
        {
            filename += '.js';
        }

        return filename.replace('.js', '.shared.js');
    }
}
