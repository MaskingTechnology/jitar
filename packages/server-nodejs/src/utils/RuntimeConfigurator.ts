
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
    #runtimeBuilder: RuntimeBuilder;

    constructor(runtimeBuilder: RuntimeBuilder)
    {
        this.#runtimeBuilder = runtimeBuilder;
    }

    async configure(configuration: RuntimeConfiguration): Promise<Service>
    {
        const url = configuration.url ?? RuntimeDefaults.URL;
        const healthChecks = configuration.healthChecks ?? [];

        await this.#buildCache(RuntimeDefaults.SOURCE, RuntimeDefaults.CACHE);

        if (configuration.repository !== undefined) return this.#configureRepository(url, healthChecks, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, healthChecks, configuration.gateway);
        if (configuration.worker !== undefined) return this.#configureWorker(url, healthChecks, configuration.worker);
        if (configuration.standalone !== undefined) return this.#configureStandalone(url, healthChecks, configuration.standalone);
        if (configuration.proxy !== undefined) return this.#configureProxy(url, configuration.proxy);

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
        const assets = await this.#getAssetFilenames(configuration.assets);

        return this.#runtimeBuilder.buildLocalRepository({ url, assets });
    }

    async #configureGateway(url: string, healthChecks: string[], configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const middlewares = configuration.middlewares ?? [];
        const monitorInterval = configuration.monitor;
        const trustKey = configuration.trustKey;

        return this.#runtimeBuilder.buildLocalGateway({ url, trustKey, healthChecks, middlewares, monitorInterval });
    }

    async #configureWorker(url: string, healthChecks: string[], configuration: WorkerConfiguration): Promise<LocalWorker>
    {
        const gatewayUrl = configuration.gateway;
        const segmentNames = configuration.segments ?? [];
        const middlewares = configuration.middlewares ?? [];
        const trustKey = configuration.trustKey;

        return this.#runtimeBuilder.buildLocalWorker({ url, trustKey, healthChecks, middlewares, segmentNames, gatewayUrl });
    }

    async #configureStandalone(url: string, healthChecks: string[], configuration: StandaloneConfiguration): Promise<Proxy>
    {
        const assets = await this.#getAssetFilenames(configuration.assets);
        const segmentNames = configuration.segments ?? [];
        const middlewares = configuration.middlewares ?? [];

        return this.#runtimeBuilder.buildStandalone({ url, assets, healthChecks, middlewares, segmentNames });
    }

    async #configureProxy(url: string, configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repositoryUrl = configuration.repository;
        const runnerUrl = configuration.gateway ?? configuration.worker;
        const middlewares = configuration.middlewares ?? [];

        if (runnerUrl === undefined)
        {
            throw new Error('Runner URL is required for proxy configuration');
        }

        return this.#runtimeBuilder.buildProxy({ url, repositoryUrl, runnerUrl });
    }

    async #getAssetFilenames(assets?: string[]): Promise<string[]>
    {
        if (assets === undefined)
        {
            return [];
        }

        const fileManager = new LocalFileManager(RuntimeDefaults.CACHE);

        return fileManager.getAssetFiles(assets);
    }
}
