
import type { GatewayConfiguration, ProxyConfiguration, RepositoryConfiguration, ServerConfiguration, StandaloneConfiguration, WorkerConfiguration } from '../../../src/server';

const serveIndexOnNotFound = true;
const assets = ['index.html', 'favicon.ico'];
const segments = ['segment'];
const indexFilename = 'index.html';
const trustKey = 'trust-key';
const gateway = 'http://gateway';
const repository = 'http://repository';

const gatewayConfiguration: GatewayConfiguration = { monitor: 5000, trustKey } as const;
const proxyConfiguration: ProxyConfiguration = { gateway, repository } as const;
const repositoryConfiguration: RepositoryConfiguration = { indexFilename, serveIndexOnNotFound, assets } as const;
const standaloneConfiguration: StandaloneConfiguration = { segments, indexFilename, serveIndexOnNotFound, assets } as const;
const workerConfiguration: WorkerConfiguration = { gateway, segments, trustKey } as const;

export const SERVER_CONFIGURATION: ServerConfiguration = 
{ 
    url: 'http://server', 
    setUp: ['setup'],
    tearDown: ['tearDown'],
    middleware: ['middleware'],
    healthChecks: ['healthChecks'],
    
    gateway: gatewayConfiguration,
    proxy: proxyConfiguration,
    repository: repositoryConfiguration,
    standalone: standaloneConfiguration,
    worker: workerConfiguration
} as const;
