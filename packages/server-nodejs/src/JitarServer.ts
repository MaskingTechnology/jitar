
import express, { Express } from 'express';
import { Server } from 'http';
import { Logger } from 'tslog';

import { LocalGateway, LocalWorker, LocalRepository, Proxy, Service, ImportFunction, SourceManager, ClassModuleLoader } from '@jitar/runtime';
import { ClassLoader, Serializer, SerializerBuilder, ValueSerializer } from '@jitar/serialization';

import ServerOptions from './configuration/ServerOptions.js';

import RuntimeConfigurationLoader from './utils/RuntimeConfigurationLoader.js';
import RuntimeConfigurator from './utils/RuntimeConfigurator.js';
import ServerOptionsReader from './utils/ServerOptionsReader.js';

import AssetsController from './controllers/AssetsController.js';
import HealthController from './controllers/HealthController.js';
import JitarController from './controllers/JitarController.js';
import ModulesController from './controllers/ModulesController.js';
import WorkerController from './controllers/WorkerController.js';
import ProceduresController from './controllers/ProceduresController.js';
import ProxyController from './controllers/ProxyController.js';
import RPCController from './controllers/RPCController.js';

import RuntimeConfiguration from './configuration/RuntimeConfiguration.js';
import RuntimeDefaults from './definitions/RuntimeDefaults.js';

import RuntimeNotAvailable from './errors/RuntimeNotAvailable.js';
import LogBuilder from './utils/LogBuilder.js';
import LocalFileManager from './utils/LocalFileManager.js';
import Headers from './definitions/Headers.js';

const STARTUP_MESSAGE = `
       ██ ██ ████████  █████  ██████  
       ██ ██    ██    ██   ██ ██   ██ 
       ██ ██    ██    ███████ ██████  
  ██   ██ ██    ██    ██   ██ ██   ██ 
   █████  ██    ██    ██   ██ ██   ██
  ____________________________________
  By Masking Technology (masking.tech)
`;

export default class JitarServer
{
    #app: Express;
    #server?: Server;

    #service?: Service;
    #serializer: Serializer;

    #configuration: RuntimeConfiguration;
    #logger: Logger<unknown>;
    #sourceManager: SourceManager;

    constructor(importFunction: ImportFunction)
    {
        const options = ServerOptionsReader.read();
        const cacheLocation = RuntimeDefaults.CACHE; // TODO: Add cache location to server options
        const fileManager = new LocalFileManager(cacheLocation);

        this.#configuration = RuntimeConfigurationLoader.load(options.config);
        this.#logger = LogBuilder.build(options.loglevel);
        this.#sourceManager = new SourceManager(importFunction, fileManager);

        const classLoader = new ClassModuleLoader(this.#sourceManager);
        this.#serializer = SerializerBuilder.build(classLoader);

        this.#app = express();
        this.#app.use(express.json({limit: options.bodylimit }));
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use((request, response, next) => this.#addDefaultHeaders(request, response, next));
        this.#app.disable('x-powered-by');

        this.#printStartupMessage();
    }

    // get classLoader(): ClassLoader
    // {
    //     return this.#classLoader;
    // }

    async build(): Promise<void>
    {
        const runtimeConfigurator = new RuntimeConfigurator(this.#sourceManager);
        this.#service = await runtimeConfigurator.configure(this.#configuration);
        this.#addControllers();
    }

    async start(): Promise<void>
    {
        const url = new URL(this.#configuration.url ?? RuntimeDefaults.URL);

        try
        {
            await this.#startApplication();
            await this.#startServer(url.port);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to start server -> ${message}`);

            await this.stop();

            return;
        }

        this.#printProcedureInfo();

        this.#logger.info(`Server started and listening at port ${url.port}`);
    }

    async stop(): Promise<void>
    {
        try
        {
            await this.#stopServer();
            await this.#stopApplication();
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Caught error while stopping server -> ${message}`);

            return;
        }
        
        this.#logger.info('Server stopped');
    }

    addSerializer(serializer: ValueSerializer): void
    {
        this.#serializer.addSerializer(serializer);
    }

    #getRuntime(): Service
    {
        if (this.#service === undefined)
        {
            throw new RuntimeNotAvailable();
        }

        return this.#service;
    }

    #addControllers(): void
    {
        if (this.#configuration.repository !== undefined && this.#service instanceof LocalRepository)
        {
            const index = this.#configuration.repository.index ?? RuntimeDefaults.INDEX;
            const serveIndexOnNotFound = this.#configuration.repository.serveIndexOnNotFound ?? RuntimeDefaults.SERVE_INDEX_ON_NOT_FOUND;

            this.#addRepositoryControllers(this.#service, index, serveIndexOnNotFound);
        }
        else if (this.#configuration.gateway !== undefined && this.#service instanceof LocalGateway)
        {
            this.#addGatewayControllers(this.#service);
        }
        else if (this.#configuration.worker !== undefined && this.#service instanceof LocalWorker)
        {
            this.#addWorkerControllers(this.#service);
        }
        else if (this.#configuration.proxy !== undefined && this.#service instanceof Proxy)
        {
            this.#addProxyControllers(this.#service);
        }
    }

    #addRepositoryControllers(repository: LocalRepository, index: string, serveIndexOnNotFound: boolean): void
    {
        new JitarController(this.#app);
        new ModulesController(this.#app, repository, this.#serializer, this.#logger);
        new AssetsController(this.#app, repository, index, serveIndexOnNotFound, this.#logger);
    }

    #addGatewayControllers(gateway: LocalGateway): void
    {
        new WorkerController(this.#app, gateway, this.#logger);
        new ProceduresController(this.#app, gateway, this.#logger);
        new RPCController(this.#app, gateway, this.#serializer, this.#logger);
    }

    #addWorkerControllers(worker: LocalWorker): void
    {
        new HealthController(this.#app, worker, this.#logger);
        new ProceduresController(this.#app, worker, this.#logger);
        new RPCController(this.#app, worker, this.#serializer, this.#logger);
    }

    #addProxyControllers(proxy: Proxy): void
    {
        new ProxyController(this.#app, proxy, this.#logger);
    }

    async #startApplication(): Promise<void>
    {
        const runtime = this.#getRuntime();

        await runtime.start();

        const setUpScripts = this.#configuration.setUp;

        if (setUpScripts === undefined)
        {
            return;
        }

        for (const setUpScript of setUpScripts)
        {
            await this.#sourceManager.import(setUpScript);
        }
    }

    async #stopApplication(): Promise<void>
    {
        const runtime = this.#getRuntime();

        await runtime.stop();

        const tearDownScripts = this.#configuration.tearDown;

        if (tearDownScripts === undefined)
        {
            return;
        }

        for (const tearDownScript of tearDownScripts)
        {
            await this.#sourceManager.import(tearDownScript);
        }
    }

    #startServer(port: string): Promise<void>
    {
        if (this.#server !== undefined)
        {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => 
        { 
            this.#server = this.#app.listen(port, resolve);
            
            this.#server.on('error', reject);
        });
    }

    #stopServer(): Promise<void>
    {
        if (this.#server === undefined)
        {
            return Promise.resolve();
        }

        return new Promise(resolve => { this.#server?.close(() => resolve()); });
    }

    #printStartupMessage(): void
    {
        console.log(STARTUP_MESSAGE);
    }

    #printProcedureInfo()
    {
        const runtime = this.#getRuntime();

        if (runtime instanceof LocalWorker === false)
        {
            return;
        }

        const procedureNames = runtime.getProcedureNames();

        if (procedureNames.length === 0)
        {
            return;
        }

        procedureNames.sort();

        this.#logger.info('Registered RPC entries', procedureNames);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #addDefaultHeaders(request: express.Request, response: express.Response, next: express.NextFunction): void
    {
        response.setHeader(Headers.CONTENT_TYPE_OPTIONS, 'nosniff');

        next();
    }
}
