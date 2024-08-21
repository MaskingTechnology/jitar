
import { Service, RuntimeBuilder, LocalRepository, LocalGateway, LocalWorker, Proxy, SourceManager } from '@jitar/runtime';
import { CacheManager } from '@jitar/caching';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.js';
import StandaloneConfiguration from '../configuration/StandaloneConfiguration.js';
import RepositoryConfiguration from '../configuration/RepositoryConfiguration.js';
import GatewayConfiguration from '../configuration/GatewayConfiguration.js';
import WorkerConfiguration from '../configuration/WorkerConfiguration.js';
import ProxyConfiguration from '../configuration/ProxyConfiguration.js';

import RuntimeDefaults from '../definitions/RuntimeDefaults.js';

import UnknownRuntimeMode from '../errors/UnknownRuntimeMode.js';

import LocalFileManager from './LocalFileManager.js';

export default class RuntimeConfigurator
{
    #sourceManager: SourceManager;

    constructor(sourceManager: SourceManager)
    {
        this.#sourceManager = sourceManager;
    }

    async configure(configuration: RuntimeConfiguration): Promise<Service>
    {
        const url = configuration.url ?? RuntimeDefaults.URL;
        const healthChecks = configuration.healthChecks ?? [];

        await this.#buildCache(RuntimeDefaults.SOURCE, RuntimeDefaults.CACHE);

        if (configuration.repository !== undefined) return this.#configureRepository(url, healthChecks, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, healthChecks, configuration.gateway);
        if (configuration.worker !== undefined) return this.#configureWorker(url, healthChecks, configuration.worker);
        if (configuration.proxy !== undefined) return this.#configureProxy(url, healthChecks, configuration.proxy);

        throw new UnknownRuntimeMode();
    }

    async #buildCache(sourceLocation: string, cacheLocation: string): Promise<void>
    {
        const projectFileManager = new LocalFileManager('./');
        await projectFileManager.delete(cacheLocation);
        await projectFileManager.copy(sourceLocation, cacheLocation);

        const appFileManager = new LocalFileManager(cacheLocation);

        const cacheManager = new CacheManager(projectFileManager, appFileManager);
        await cacheManager.build();
    }

    async #configureRepository(url: string, healthChecks: string[], configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const cacheLocation = RuntimeDefaults.CACHE;
        const fileManager = new LocalFileManager(cacheLocation);

        const assets = configuration.assets !== undefined
            ? await fileManager.getAssetFiles(configuration.assets)
            : [];

        return new RuntimeBuilder(url, this.#sourceManager)
            .healthCheck(...healthChecks)
            .asset(...assets)
            .buildRepository();
    }

    async #configureGateway(url: string, healthChecks: string[], configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const repositoryUrl = configuration.repository;
        const middlewares = configuration.middlewares ?? [];
        const monitorInterval = configuration.monitor;
        const trustKey = configuration.trustKey;

        return new RuntimeBuilder(url, this.#sourceManager)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .buildGateway(trustKey);
    }

    async #configureWorker(url: string, healthChecks: string[], configuration: WorkerConfiguration): Promise<LocalWorker>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const segmentNames = configuration.segments ?? [];
        const middlewares = configuration.middlewares ?? [];
        const trustKey = configuration.trustKey;

        return new RuntimeBuilder(url, this.#sourceManager)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .segment(...segmentNames)
            .buildWorker(trustKey);
    }

    async #configureProxy(url: string, healthChecks: string[], configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const workerUrl = configuration.worker;
        const middlewares = configuration.middlewares ?? [];

        return new RuntimeBuilder(url, this.#sourceManager)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .worker(workerUrl)
            .buildProxy();
    }
}
