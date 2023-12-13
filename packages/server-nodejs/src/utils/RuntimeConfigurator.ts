
import { Runtime, RuntimeBuilder, LocalRepository, LocalGateway, LocalNode, NodeMonitor, Proxy, Standalone, FileManager } from '@jitar/runtime';
import { CacheManager } from '@jitar/caching';

import LocalFileManager from './LocalFileManager.js';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.js';
import StandaloneConfiguration from '../configuration/StandaloneConfiguration.js';
import RepositoryConfiguration from '../configuration/RepositoryConfiguration.js';
import GatewayConfiguration from '../configuration/GatewayConfiguration.js';
import NodeConfiguration from '../configuration/NodeConfiguration.js';
import ProxyConfiguration from '../configuration/ProxyConfiguration.js';

import RuntimeDefaults from '../definitions/RuntimeDefaults.js';

import UnknownRuntimeMode from '../errors/UnknownRuntimeMode.js';

export default class RuntimeConfigurator
{
    static async configure(configuration: RuntimeConfiguration): Promise<Runtime>
    {
        const url = configuration.url ?? RuntimeDefaults.URL;
        const healthChecks = configuration.healthChecks ?? [];

        if (configuration.standalone !== undefined) return this.#configureStandAlone(url, healthChecks, configuration.standalone);
        if (configuration.repository !== undefined) return this.#configureRepository(url, healthChecks, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, healthChecks, configuration.gateway);
        if (configuration.node !== undefined) return this.#configureNode(url, healthChecks, configuration.node);
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

        await this.#buildCache(sourceLocation, cacheLocation);

        const segmentNames = configuration.segments === undefined
            ? await this.#getNodeSegmentNames(fileManager)
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
            .buildStandalone();
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

        const gateway = new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .buildGateway();

        new NodeMonitor(gateway, monitorInterval);

        return gateway;
    }

    static async #configureNode(url: string, healthChecks: string[], configuration: NodeConfiguration): Promise<LocalNode>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const segmentNames = configuration.segments ?? [];
        const middlewares = configuration.middlewares ?? [];

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .segment(...segmentNames)
            .buildNode();
    }

    static async #configureProxy(url: string, healthChecks: string[], configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repositoryUrl = configuration.repository;
        const gatewayUrl = configuration.gateway;
        const nodeUrl = configuration.node;
        const middlewares = configuration.middlewares ?? [];

        return new RuntimeBuilder()
            .url(url)
            .healthCheck(...healthChecks)
            .middleware(...middlewares)
            .repository(repositoryUrl)
            .gateway(gatewayUrl)
            .node(nodeUrl)
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

    static async #getNodeSegmentNames(fileManager: LocalFileManager): Promise<string[]>
    {
        const segmentFilenames = await fileManager.getNodeSegmentFiles();

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
