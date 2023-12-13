
import { Runtime, LocalRepository, LocalGateway, LocalNode, RemoteRepository, RemoteGateway, RemoteNode, NodeMonitor, Proxy, Standalone, Repository, Gateway, ProcedureRuntime, DummyRepository } from '@jitar/runtime';
import { CacheManager } from '@jitar/caching';

import LocalFileManager from './LocalFileManager.js';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.js';
import ProcedureRuntimeConfiguration from '../configuration/ProcedureRuntimeConfiguration.js';
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
        const runtime = await this.configureService(configuration);

        await this.#addHealthChecks(runtime, configuration);

        return runtime;
    }

    static async configureService(configuration: RuntimeConfiguration): Promise<Runtime>
    {
        const url = configuration.url ?? RuntimeDefaults.URL;

        if (configuration.standalone !== undefined) return this.#configureStandAlone(url, configuration.standalone);
        if (configuration.repository !== undefined) return this.#configureRepository(url, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, configuration.gateway);
        if (configuration.node !== undefined) return this.#configureNode(url, configuration.node);
        if (configuration.proxy !== undefined) return this.#configureProxy(url, configuration.proxy);

        throw new UnknownRuntimeMode();
    }

    static async #configureStandAlone(url: string, configuration: StandaloneConfiguration): Promise<Standalone>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const assetFilePatterns = configuration.assets;
        const overriddenFiles = configuration.overrides;

        await this.#buildCache(sourceLocation, cacheLocation);

        const segmentNames = configuration.segments === undefined
            ? await this.#getSegmentNames(cacheLocation)
            : configuration.segments;

        const repository = await this.#buildRepository(url, cacheLocation, assetFilePatterns, overriddenFiles);
        const node = await this.#buildNode(segmentNames, repository, undefined, url);
        const standalone = await this.#buildStandalone(repository, node, url);

        await this.#addMiddlewares(standalone, configuration);

        return standalone;
    }

    static async #configureRepository(url: string, configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const assetFilePatterns = configuration.assets;
        const overriddenFiles = configuration.overrides;

        await this.#buildCache(sourceLocation, cacheLocation);
        
        return this.#buildRepository(url, cacheLocation, assetFilePatterns, overriddenFiles);
    }

    static async #configureGateway(url: string, configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const repository = this.#getRemoteRepository(configuration.repository);
        const gateway = await this.#buildGateway(repository, url, configuration.monitor);

        await this.#addMiddlewares(gateway, configuration);

        return gateway;
    }

    static async #configureNode(url: string, configuration: NodeConfiguration): Promise<LocalNode>
    {
        const segmentNames = configuration.segments ?? [];

        const repository = this.#getRemoteRepository(configuration.repository);
        const gateway = this.#getRemoteGateway(configuration.gateway);
        const node = await this.#buildNode(segmentNames, repository, gateway, url);

        if (repository instanceof RemoteRepository)
        {
            repository.segmentNames = segmentNames;
        }

        if (gateway instanceof RemoteGateway)
        {
            gateway.node = node;
        }

        await this.#addMiddlewares(node, configuration);

        return node;
    }

    static async #configureProxy(url: string, configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repository = this.#getRemoteRepository(configuration.repository) as RemoteRepository;
        const gateway = this.#getRemoteGateway(configuration.gateway) as RemoteGateway;

        const node = configuration.node !== undefined
            ? new RemoteNode([], configuration.node)
            : undefined;

        const runner = gateway ?? node;

        const proxy = await this.#buildProxy(repository, runner, url);

        await this.#addMiddlewares(proxy, configuration);

        return proxy;
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

    static async #getSegmentNames(cacheLocation: string): Promise<string[]>
    {
        const fileManager = new LocalFileManager(cacheLocation);
        const segmentFilenames = await fileManager.getNodeSegmentFiles();

        return segmentFilenames.map(filename => this.#extractSegmentName(filename));
    }

    static #extractSegmentName(filename: string): string
    {
        const name = filename.split('/').pop() ?? '';
        const endIndex = name.indexOf('.segment');

        return name.substring(0, endIndex);
    }

    static async #buildRepository(url: string | undefined, cacheLocation: string, assetFilePatterns?: string[], overriddenFiles?: Record<string, string>): Promise<LocalRepository>
    {
        const fileManager = new LocalFileManager(cacheLocation);

        const assets = assetFilePatterns !== undefined
            ? await fileManager.getAssetFiles(assetFilePatterns)
            : [];

        const overrides = overriddenFiles !== undefined
            ? this.#mapOverriddenFiles(overriddenFiles, fileManager)
            : new Map();
        
        const segmentFilenames = await fileManager.getRepositorySegmentFiles();
        const segmentNames = segmentFilenames.map(filename => this.#extractSegmentName(filename));

        return new LocalRepository(fileManager, segmentNames, assets, overrides, url);
    }

    static async #buildGateway(repository: Repository, url?: string, monitorInterval?: number): Promise<LocalGateway>
    {
        const gateway = new LocalGateway(repository, url);
        const monitor = new NodeMonitor(gateway, monitorInterval);

        monitor.start();

        return gateway;
    }

    static async #buildNode(segmentNames: string[], repository: Repository, gateway?: Gateway, url?: string): Promise<LocalNode>
    {
        return new LocalNode(segmentNames, repository, gateway, url);
    }

    static async #buildProxy(repository: RemoteRepository, runner: RemoteGateway | RemoteNode, url?: string): Promise<Proxy>
    {
        return new Proxy(repository, runner, url);
    }

    static async #buildStandalone(repository: LocalRepository, node: LocalNode, url?: string): Promise<Standalone>
    {
        return new Standalone(repository, node, url);
    }

    static #getRemoteRepository(url?: string): RemoteRepository | DummyRepository
    {
        return url !== undefined
            ? new RemoteRepository(url)
            : new DummyRepository();
    }

    static #getRemoteGateway(url?: string): RemoteGateway | undefined
    {
        return url !== undefined
            ? new RemoteGateway(url)
            : undefined;
    }

    static #mapOverriddenFiles(overriddenFiles: Record<string, string>, fileManager: LocalFileManager): Map<string, string>
    {
        const overrides = new Map<string, string>();

        for (const [key, value] of Object.entries(overriddenFiles))
        {
            const filename = fileManager.getRelativeLocation(key);
            const override = fileManager.getRelativeLocation(value);

            overrides.set(filename, override);
        }

        return overrides;
    }

    static async #addHealthChecks(runtime: Runtime, configuration: RuntimeConfiguration): Promise<void>
    {
        if (configuration.healthChecks === undefined)
        {
            return;
        }

        for (const url of configuration.healthChecks)
        {
            await runtime.importHealthCheck(url);
        }
    }

    static async #addMiddlewares(runtime: ProcedureRuntime, configuration: ProcedureRuntimeConfiguration): Promise<void>
    {
        if (configuration.middlewares === undefined)
        {
            return;
        }

        for (const url of configuration.middlewares)
        {
            await runtime.importMiddleware(url);
        }
    }
}
