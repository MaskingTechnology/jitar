
import { Runtime, LocalRepository, LocalGateway, LocalNode, RemoteRepository, RemoteGateway, RemoteNode, NodeMonitor, Proxy, Repository, Gateway, Node } from '@jitar/runtime';
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

        if (configuration.standalone !== undefined) return this.#configureStandAlone(url, configuration.standalone);
        if (configuration.repository !== undefined) return this.#configureRepository(url, configuration.repository);
        if (configuration.gateway !== undefined) return this.#configureGateway(url, configuration.gateway);
        if (configuration.node !== undefined) return this.#configureNode(url, configuration.node);
        if (configuration.proxy !== undefined) return this.#configureProxy(url, configuration.proxy);

        throw new UnknownRuntimeMode();
    }

    static async #configureStandAlone(url: string, configuration: StandaloneConfiguration): Promise<Proxy>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const assetFilePatterns = configuration.assets;

        await this.#buildCache(sourceLocation, cacheLocation);

        const segmentNames = configuration.segments === undefined
            ? await this.#getSegmentNames(cacheLocation)
            : configuration.segments;

        const repository = await this.#buildRepository(url, cacheLocation, assetFilePatterns);
        const node = await this.#buildNode(url, segmentNames, repository);

        return this.#buildProxy(url, repository, node);
    }

    static async #configureRepository(url: string, configuration: RepositoryConfiguration): Promise<LocalRepository>
    {
        const sourceLocation = configuration.source ?? RuntimeDefaults.SOURCE;
        const cacheLocation = configuration.cache ?? RuntimeDefaults.CACHE;
        const assetFilePatterns = configuration.assets ?? [];

        await this.#buildCache(sourceLocation, cacheLocation);
        return this.#buildRepository(url, cacheLocation, assetFilePatterns);
    }

    static async #configureGateway(url: string, configuration: GatewayConfiguration): Promise<LocalGateway>
    {
        const repository = this.#getRemoteRepository(configuration.repository);

        return this.#buildGateway(url, configuration.monitor, repository);
    }

    static async #configureNode(url: string, configuration: NodeConfiguration): Promise<LocalNode>
    {
        const segmentNames = configuration.segments ?? [];

        const repository = this.#getRemoteRepository(configuration.repository);
        const gateway = this.#getRemoteGateway(configuration.gateway);

        return this.#buildNode(url, segmentNames, repository, gateway);
    }

    static async #configureProxy(url: string, configuration: ProxyConfiguration): Promise<Proxy>
    {
        const repository = this.#getRemoteRepository(configuration.repository) as RemoteRepository;
        const gateway = this.#getRemoteGateway(configuration.gateway) as RemoteGateway;

        const node = configuration.node !== undefined
            ? new RemoteNode(configuration.node, [])
            : undefined;

        const runner = gateway ?? node;

        return this.#buildProxy(url, repository, runner);
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

    static async #buildRepository(url: string | undefined, cacheLocation: string, assetFilePatterns?: string[]): Promise<LocalRepository>
    {
        const fileManager = new LocalFileManager(cacheLocation);

        const assetFiles = assetFilePatterns !== undefined
            ? await fileManager.getAssetFiles(assetFilePatterns)
            : [];

        const repository = new LocalRepository(fileManager, assetFiles, url);

        const segmentFilenames = await fileManager.getRepositorySegmentFiles();
        const segmentNames = segmentFilenames.map(filename => this.#extractSegmentName(filename));

        for (const name of segmentNames)
        {
            await repository.loadSegment(name);
        }

        return repository;
    }

    static async #buildGateway(url?: string, monitorInterval?: number, repository?: Repository): Promise<LocalGateway>
    {
        const gateway = new LocalGateway(url);

        if (repository !== undefined)
        {
            await gateway.setBaseUrl(repository);
        }

        const monitor = new NodeMonitor(gateway, monitorInterval);

        monitor.start();

        return gateway;
    }

    static async #buildNode(url: string | undefined, segmentNames: string[], repository?: Repository, gateway?: Gateway): Promise<LocalNode>
    {
        const node = new LocalNode(url);

        if (repository !== undefined)
        {
            await node.setRepository(repository, segmentNames);
        }

        for (const segmentName of segmentNames)
        {
            await node.loadSegment(segmentName);
        }

        // All segments have to be loaded before a node
        // can be registered at the gateway

        if (gateway !== undefined)
        {
            node.setGateway(gateway);
        }

        return node;
    }

    static async #buildProxy(url: string | undefined, repository: Repository, runner: Gateway | Node): Promise<Proxy>
    {
        return new Proxy(repository, runner, url);
    }

    static #getRemoteRepository(url?: string): RemoteRepository | undefined
    {
        return url !== undefined
            ? new RemoteRepository(url)
            : undefined;
    }

    static #getRemoteGateway(url?: string): RemoteGateway | undefined
    {
        return url !== undefined
            ? new RemoteGateway(url)
            : undefined;
    }
}
