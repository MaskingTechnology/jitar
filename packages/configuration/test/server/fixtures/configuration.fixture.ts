
import type { GatewayConfiguration, ProxyConfiguration, RemoteWorkerConfiguration, RepositoryConfiguration, ServerConfiguration, StandaloneConfiguration, WorkerConfiguration } from '../../../src/server';

const serveIndexOnNotFound = true;
const assets = ['index.html', 'favicon.ico'];
const segments = ['segment'];
const indexFilename = 'index.html';
const trustKey = 'trust-key';
const gateway = 'https://gateway';
const repository = 'https://repository';

const gatewayConfiguration: GatewayConfiguration = { monitorInterval: 5000, trustKey } as const;
const proxyConfiguration: ProxyConfiguration = { gateway, repository } as const;
const repositoryConfiguration: RepositoryConfiguration = { indexFilename, serveIndexOnNotFound, assets } as const;
const standaloneConfiguration: StandaloneConfiguration = { segments, indexFilename, serveIndexOnNotFound, assets } as const;
const workerConfiguration: WorkerConfiguration = { gateway, segments, trustKey } as const;
const remoteWorkerConfiguration: RemoteWorkerConfiguration = { unavailableThreshold: 6000, stoppedThreshold: 18000 } as const;

export const SERVER_CONFIGURATION: ServerConfiguration = 
{ 
    url: 'https://server', 
    setUp: ['setup'],
    tearDown: ['tearDown'],
    middleware: ['middleware'],
    healthChecks: ['healthChecks'],
    
    gateway: gatewayConfiguration,
    proxy: proxyConfiguration,
    repository: repositoryConfiguration,
    standalone: standaloneConfiguration,
    worker: workerConfiguration,
    remoteWorker: remoteWorkerConfiguration
} as const;
