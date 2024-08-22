
import { Serializer, SerializerBuilder } from '@jitar/serialization';

import { ExecutionManager } from './execution';
import { RemoteRepository, LocalRepository, RemoteGateway, LocalGateway, RemoteWorker, LocalWorker, Proxy, Remote, RunnerService } from './services';
import { HealthManager } from './health';
import { MiddlewareManager } from './middleware';
import { SourceManager, ClassModuleLoader } from './source';

type ServiceConfiguration =
{
    url: string;
}

type RunnerServiceConfiguration = ServiceConfiguration &
{
    trustKey?: string;
    healthChecks: string[];
    middlewares: string[];
}

type LocalGatewayConfiguration = RunnerServiceConfiguration &
{
    monitorInterval?: number;
};

type LocalWorkerConfiguration = RunnerServiceConfiguration &
{
    segmentNames: string[];
    gatewayUrl?: string;
};

type LocalRepositoryConfiguration = ServiceConfiguration &
{
    assets: string[];
};

type ProxyConfiguration = ServiceConfiguration &
{
    repositoryUrl: string;
    runnerUrl: string;
};

type StandaloneConfiguration = LocalWorkerConfiguration & LocalRepositoryConfiguration;

export default class RuntimeBuilder
{
    #sourceManager: SourceManager;
    #serializer: Serializer;

    constructor(sourceManager: SourceManager)
    {
        this.#sourceManager = sourceManager;
        this.#serializer = this.#buildSerializer();
    }

    get sourceManager() { return this.#sourceManager; }

    get serializer() { return this.#serializer; }

    async buildLocalGateway(configuration: LocalGatewayConfiguration): Promise<LocalGateway>
    {
        const url = configuration.url;
        const trustKey = configuration.trustKey;
        const healthManager = await this.#buildHealthManager(configuration.healthChecks);
        const middlewareManager = await this.#buildMiddlewareManager(configuration.middlewares);
        const monitorInterval = configuration.monitorInterval;

        return new LocalGateway({ url, trustKey, healthManager, middlewareManager, monitorInterval });
    }

    buildRemoteGateway(url: string): RemoteGateway
    {
        const remote = this.#buildRemote(url);

        return new RemoteGateway({ url, remote });
    }

    async buildLocalWorker(configuration: LocalWorkerConfiguration): Promise<LocalWorker>
    {
        const url = configuration.url;
        const trustKey = configuration.trustKey;
        const gateway = configuration.gatewayUrl ? this.buildRemoteGateway(configuration.gatewayUrl) : undefined;
        const healthManager = await this.#buildHealthManager(configuration.healthChecks);
        const middlewareManager = await this.#buildMiddlewareManager(configuration.middlewares);
        const executionManager = await this.#buildExecutionManager(configuration.segmentNames);

        return new LocalWorker({ url, trustKey, gateway, healthManager, middlewareManager, executionManager });
    }

    buildRemoteWorker(url: string, procedures: string[]): RemoteWorker
    {
        const procedureNames = new Set<string>(procedures);
        const remote = this.#buildRemote(url);

        return new RemoteWorker({ url, procedureNames, remote });
    }

    async buildLocalRepository(configuration: LocalRepositoryConfiguration): Promise<LocalRepository>
    {
        const url = configuration.url;
        const sourceManager = this.#sourceManager;
        const assets = new Set(configuration.assets);

        return new LocalRepository({ url, sourceManager, assets });
    }

    buildRemoteRepository(url: string): RemoteRepository
    {
        const remote = this.#buildRemote(url);

        return new RemoteRepository({ url, remote });
    }

    async buildProxy(configuration: ProxyConfiguration): Promise<Proxy>
    {
        const url = configuration.url;
        const repository = this.buildRemoteRepository(configuration.repositoryUrl);
        const runner = this.buildRemoteWorker(configuration.runnerUrl ,[]);

        return new Proxy({ url, repository, runner });
    }

    async buildStandalone(configuration: StandaloneConfiguration): Promise<Proxy>
    {
        const url = configuration.url;
        const repository = await this.buildLocalRepository(configuration);
        const runner = await this.buildLocalWorker(configuration);

        return new Proxy({ url, repository, runner });
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

    async #buildHealthManager(filenames: string[]): Promise<HealthManager>
    {
        const manager = new HealthManager(this.#sourceManager);

        await Promise.all(filenames.map(filename => manager.importHealthCheck(filename)));

        return manager;
    }

    async #buildMiddlewareManager(filenames: string[]): Promise<MiddlewareManager>
    {
        const manager = new MiddlewareManager(this.#sourceManager);

        await Promise.all(filenames.map(filename => manager.importMiddleware(filename)));

        return manager;
    }

    async #buildExecutionManager(segmentNames: string[]): Promise<ExecutionManager>
    {
        const manager = new ExecutionManager(this.#sourceManager);
        const filenames = segmentNames.map(name => `./${name}.segment.js`);

        await Promise.all(filenames.map(filename => manager.importSegment(filename)));

        return manager;
    }
}
