
import { ServerConfiguration, GatewayConfiguration, WorkerConfiguration, RepositoryConfiguration, ProxyConfiguration, StandaloneConfiguration } from '@jitar/configuration';
import { ExecutionManager } from '@jitar/execution';
import { Serializer, SerializerBuilder } from '@jitar/serialization';
import { RemoteRepository, LocalRepository, RemoteGateway, LocalGateway, LocalWorker, Proxy, DummyProvider, DummyRunner, Remote, Client, Server } from '@jitar/services';
import { HealthManager } from '@jitar/health';
import { MiddlewareManager } from '@jitar/middleware';
import { SourcingManager } from '@jitar/sourcing';

import ClassModuleLoader from './ClassModuleLoader';

type ClientConfiguration =
{
    remoteUrl: string;
    segmentNames: string[];
    middlewares: string[];
};

export default class RuntimeBuilder
{
    #sourcingManager: SourcingManager;
    #serializer: Serializer;

    constructor(sourcingManager: SourcingManager)
    {
        this.#sourcingManager = sourcingManager;
        this.#serializer = this.#buildSerializer();
    }

    get sourcingManager() { return this.#sourcingManager; }

    get serializer() { return this.#serializer; }

    async buildClient(configuration: ClientConfiguration): Promise<Client>
    {
        const gateway = this.#buildRemoteGateway(configuration.remoteUrl);
        const middlewareManager = await this.#buildMiddlewareManager(configuration.middlewares);
        const executionManager = await this.#buildExecutionManager(configuration.segmentNames);

        return new Client({ gateway, middlewareManager, executionManager });
    }

    async buildServer(configuration: ServerConfiguration): Promise<Server>
    {
        const proxy = await this.#buildService(configuration);
        const sourcingManager = this.#sourcingManager;
        const serializer = this.#serializer;
        const setUpScripts = configuration.setUp ?? [];
        const tearDownScripts = configuration.tearDown ?? [];

        return new Server({ proxy, sourcingManager, serializer, setUpScripts, tearDownScripts });
    }

    #buildService(configuration: ServerConfiguration): Promise<Proxy>
    {
        if (configuration.gateway !== undefined) return this.#buildGatewayProxy(configuration.url, configuration.gateway);
        if (configuration.worker !== undefined) return this.#buildWorkerProxy(configuration.url, configuration.worker);
        if (configuration.repository !== undefined) return this.#buildRepositoryProxy(configuration.url, configuration.repository);
        if (configuration.proxy !== undefined) return this.#buildProxy(configuration.url, configuration.proxy);
        if (configuration.standalone !== undefined) return this.#buildStandalone(configuration.url, configuration.standalone);

        throw new Error('Invalid server configuration');
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
        const middlewareManager = await this.#buildMiddlewareManager(configuration.middleware);
        const monitorInterval = configuration.monitor;

        return new LocalGateway({ url, trustKey, healthManager, middlewareManager, monitorInterval });
    }

    #buildRemoteGateway(url: string): RemoteGateway
    {
        const remote = this.#buildRemote(url);

        return new RemoteGateway({ url, remote });
    }

    async #buildLocalWorker(url: string, configuration: WorkerConfiguration): Promise<LocalWorker>
    {
        const trustKey = configuration.trustKey;
        const gateway = configuration.gateway ? this.#buildRemoteGateway(configuration.gateway) : undefined;
        const healthManager = await this.#buildHealthManager(configuration.healthChecks);
        const middlewareManager = await this.#buildMiddlewareManager(configuration.middleware);
        const executionManager = await this.#buildExecutionManager(configuration.segments);

        return new LocalWorker({ url, trustKey, gateway, healthManager, middlewareManager, executionManager });
    }

    async #buildLocalRepository(url: string, configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const sourcingManager = this.#sourcingManager;
        const assets = await this.#buildAssetSet(configuration.assets);

        return new LocalRepository({ url, sourcingManager, assets });
    }

    #buildRemoteRepository(url: string): RemoteRepository
    {
        const remote = this.#buildRemote(url);

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

    #buildRemote(url: string): Remote
    {
        const serializer = this.#buildSerializer();

        return new Remote(url, serializer);
    }

    #buildSerializer(): Serializer
    {
        const classLoader = new ClassModuleLoader(this.#sourcingManager);

        return SerializerBuilder.build(classLoader);
    }

    async #buildHealthManager(filenames?: string[]): Promise<HealthManager>
    {
        const manager = new HealthManager(this.#sourcingManager);

        if (filenames !== undefined)
        {
            await Promise.all(filenames.map(filename => manager.importHealthCheck(filename)));
        }

        return manager;
    }

    async #buildMiddlewareManager(filenames?: string[]): Promise<MiddlewareManager>
    {
        const manager = new MiddlewareManager(this.#sourcingManager);

        if (filenames !== undefined)
        {
            await Promise.all(filenames.map(filename => manager.importMiddleware(filename)));
        }

        return manager;
    }

    async #buildExecutionManager(segmentNames: string[]): Promise<ExecutionManager>
    {
        const manager = new ExecutionManager(this.#sourcingManager);
        const filenames = segmentNames.map(name => `./${name}.segment.js`);

        await Promise.all(filenames.map(filename => manager.importSegment(filename)));

        return manager;
    }

    async #buildAssetSet(patterns: string[]): Promise<Set<string>>
    {
        const filenames = await this.#sourcingManager.filter(...patterns);

        return new Set(filenames);
    }
}
