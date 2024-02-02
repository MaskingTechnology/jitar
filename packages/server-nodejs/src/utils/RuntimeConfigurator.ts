
import { Runtime, RuntimeBuilder, LocalRepository, LocalGateway, LocalWorker, WorkerMonitor, Proxy, Standalone } from '@jitar/runtime';
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
    static async configure(configuration: RuntimeConfiguration): Promise<Runtime>
    {
        const url = configuration.url ?? RuntimeDefaults.URL;
        const healthChecks = configuration.healthChecks ?? [];

        if (configuration.standalone !== undefined) return this.#configureStandAlone(url, healthChecks, configuration.standalone);
        if (configuration.repository !== undefined) return this.#configureRepository(url, healthChecks, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, healthChecks, configuration.gateway);
        if (configuration.worker !== undefined) return this.#configureWorker(url, healthChecks, configuration.worker);
        if (configuration.proxy !== undefined) return this.#configureProxy(url, healthChecks, configuration.proxy);

        throw new UnknownRuntimeMode();
    }

    static async #configureStandAlone(url: string, healthChecks: string[], configuration: StandaloneConfiguration): Promise<Standalone>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const overrides = configuration.overrides ?? {};
        const middlewares = configuration.middlewares ?? [];
        const fileManager = new LocalFileManager(cacheLocation);
        const trustKey = configuration.trustKey;

        await this.#buildCache(sourceLocation, cacheLocation);

        const segmentNames = configuration.segments === undefined
            ? await this.#getWorkerSegmentNames(fileManager)
            : configuration.segments;

        const assets = configuration.assets !== undefined
            ? await fileManager.getAssetFiles(configuration.assets)
            : [];

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .segment(...segmentNames)
            .asset(...assets)
            .override(overrides)
            .fileManager(fileManager)
            .buildStandalone(trustKey);
    }

    static async #configureRepository(url: string, healthChecks: string[], configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const overrides = configuration.overrides ?? {};
        const fileManager = new LocalFileManager(cacheLocation);

        await this.#buildCache(sourceLocation, cacheLocation);

        const segmentNames = await this.#getRepositorySegmentNames(fileManager);

        const assets = configuration.assets !== undefined
            ? await fileManager.getAssetFiles(configuration.assets)
            : [];

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .segment(...segmentNames)
            .asset(...assets)
            .override(overrides)
            .fileManager(fileManager)
            .buildRepository();
    }

    static async #configureGateway(url: string, healthChecks: string[], configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const repositoryUrl = configuration.repository;
        const middlewares = configuration.middlewares ?? [];
        const monitorInterval = configuration.monitor;
        const trustKey = configuration.trustKey;

        const gateway = new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .buildGateway(trustKey);

        new WorkerMonitor(gateway, monitorInterval);

        return gateway;
    }

    static async #configureWorker(url: string, healthChecks: string[], configuration: WorkerConfiguration): Promise<LocalWorker>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const segmentNames = configuration.segments ?? [];
        const middlewares = configuration.middlewares ?? [];
        const trustKey = configuration.trustKey;

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .segment(...segmentNames)
            .buildWorker(trustKey);
    }

    static async #configureProxy(url: string, healthChecks: string[], configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const workerUrl = configuration.worker;
        const middlewares = configuration.middlewares ?? [];

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .worker(workerUrl)
            .buildProxy();
    }

    static async #buildCache(sourceLocation: string, cacheLocation: string): Promise<void>
    {
        const projectFileManager = new LocalFileManager('./');
        await projectFileManager.delete(cacheLocation);
        await projectFileManager.copy(sourceLocation, cacheLocation);

        const appFileManager = new LocalFileManager(cacheLocation);

        const cacheManager = new CacheManager(projectFileManager, appFileManager);
        await cacheManager.build();
    }

    static async #getWorkerSegmentNames(fileManager: LocalFileManager): Promise<string[]>
    {
        const segmentFilenames = await fileManager.getWorkerSegmentFiles();

        return segmentFilenames.map(filename => this.#extractSegmentName(filename));
    }

    static async #getRepositorySegmentNames(fileManager: LocalFileManager): Promise<string[]>
    {
        const segmentFilenames = await fileManager.getRepositorySegmentFiles();

        return segmentFilenames.map(filename => this.#extractSegmentName(filename));
    }

    static #extractSegmentName(filename: string): string
    {
        const name = filename.split('/').pop() ?? '';
        const endIndex = name.indexOf('.segment');

        return name.substring(0, endIndex);
    }
}
