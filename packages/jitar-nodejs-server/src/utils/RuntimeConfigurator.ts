
import { Runtime, LocalRepository, LocalGateway, LocalNode, RemoteRepository, RemoteGateway, RemoteNode, CacheBuilder, NodeMonitor, Proxy, Repository, Gateway, Node } from 'jitar';

import LocalFileManager from './LocalFileManager.js';

import RuntimeConfiguration from '../configuration/RuntimeConfiguration.js';
import StandaloneConfiguration from '../configuration/StandaloneConfiguration.js';
import RepositoryConfiguration from '../configuration/RepositoryConfiguration.js';
import GatewayConfiguration from '../configuration/GatewayConfiguration.js';
import NodeConfiguration from '../configuration/NodeConfiguration.js';
import ProxyConfiguration from '../configuration/ProxyConfiguration.js';

import RuntimeDefaults from '../definitions/RuntimeDefaults.js';

import MissingConfigurationValue from '../errors/MissingConfigurationValue.js';
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
        return this.#buildGateway(url, configuration.monitor);
    }

    static async #configureNode(url: string, configuration: NodeConfiguration): Promise<LocalNode>
    {
        const segmentNames = configuration.segments ?? [];

        const repository = configuration.repository !== undefined
            ? new RemoteRepository(configuration.repository)
            : undefined;

        const gateway = configuration.gateway !== undefined
            ? new RemoteGateway(configuration.gateway)
            : undefined;

        return this.#buildNode(url, segmentNames, repository, gateway);
    }

    static async #configureProxy(url: string, configuration: ProxyConfiguration): Promise<Proxy>
    {
        if (configuration.repository === undefined)
        {
            throw new MissingConfigurationValue('proxy.repository');
        }

        const repository = new RemoteRepository(configuration.repository);

        const gateway = configuration.gateway !== undefined
            ? new RemoteGateway(configuration.gateway)
            : undefined;

        const node = configuration.node !== undefined
            ? new RemoteNode(configuration.node, [])
            : undefined;

        const runner = gateway ?? node;

        if (runner === undefined)
        {
            throw new MissingConfigurationValue('proxy.gateway or proxy.node');
        }

        return this.#buildProxy(url, repository, runner);
    }

    static async #buildCache(sourceLocation: string, cacheLocation: string): Promise<LocalFileManager>
    {
        const rootManager = new LocalFileManager('./');
        await rootManager.remove(cacheLocation);
        await rootManager.copy(sourceLocation, cacheLocation);

        const sourceManager = new LocalFileManager(sourceLocation);
        const cacheManager = new LocalFileManager(cacheLocation);

        const segmentFiles = await rootManager.getSegmentFiles();
        const moduleFiles = await sourceManager.getModuleFileNames();

        const cacheBuilder = new CacheBuilder(sourceManager, cacheManager);
        await cacheBuilder.build(segmentFiles, moduleFiles);

        return cacheManager;
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

    static async #buildGateway(url?: string, monitorInterval?: number): Promise<LocalGateway>
    {
        const gateway = new LocalGateway(url);
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
}
