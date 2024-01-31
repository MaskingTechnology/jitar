
import express, { Express } from 'express';
import { Server } from 'http';
import { Logger } from 'tslog';

import { LocalGateway, LocalNode, LocalRepository, Proxy, Runtime, RemoteClassLoader, ExecutionScopes, Standalone } from '@jitar/runtime';
import { ClassLoader, Serializer, SerializerBuilder, ValueSerializer } from '@jitar/serialization';

import ServerOptions from './configuration/ServerOptions.js';

import RuntimeConfigurationLoader from './utils/RuntimeConfigurationLoader.js';
import RuntimeConfigurator from './utils/RuntimeConfigurator.js';
import ServerOptionsReader from './utils/ServerOptionsReader.js';

import AssetsController from './controllers/AssetsController.js';
import HealthController from './controllers/HealthController.js';
import JitarController from './controllers/JitarController.js';
import ModulesController from './controllers/ModulesController.js';
import NodesController from './controllers/NodesController.js';
import ProceduresController from './controllers/ProceduresController.js';
import ProxyController from './controllers/ProxyController.js';
import RPCController from './controllers/RPCController.js';

import RuntimeConfiguration from './configuration/RuntimeConfiguration.js';
import RuntimeDefaults from './definitions/RuntimeDefaults.js';

import RuntimeNotAvailable from './errors/RuntimeNotAvailable.js';
import LogBuilder from './utils/LogBuilder.js';
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

    #runtime?: Runtime;
    #serializer: Serializer;
    #classLoader: ClassLoader;

    #options: ServerOptions;
    #configuration: RuntimeConfiguration;
    #logger: Logger<unknown>;

    constructor()
    {
        this.#classLoader = new RemoteClassLoader();
        this.#serializer = SerializerBuilder.build(this.#classLoader);

        this.#app = express();

        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use((request, response, next) => this.#addDefaultHeaders(request, response, next));

        this.#app.disable('x-powered-by');

        this.#options = ServerOptionsReader.read();
        this.#configuration = RuntimeConfigurationLoader.load(this.#options.config);
        this.#logger = LogBuilder.build(this.#options.loglevel);

        this.#printStartupMessage();
    }

    get classLoader(): ClassLoader
    {
        return this.#classLoader;
    }

    async build(): Promise<void>
    {
        this.#runtime = await RuntimeConfigurator.configure(this.#configuration);
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

    #getRuntime(): Runtime
    {
        if (this.#runtime === undefined)
        {
            throw new RuntimeNotAvailable();
        }

        return this.#runtime;
    }

    #addControllers(): void
    {
        if (this.#configuration.standalone !== undefined && this.#runtime instanceof Standalone)
        {
            const index = this.#configuration.standalone.index ?? RuntimeDefaults.INDEX;

            this.#addStandAloneControllers(this.#runtime, index);
        }
        else if (this.#configuration.repository !== undefined && this.#runtime instanceof LocalRepository)
        {
            const index = this.#configuration.repository.index ?? RuntimeDefaults.INDEX;

            this.#addRepositoryControllers(this.#runtime, index);
        }
        else if (this.#configuration.gateway !== undefined && this.#runtime instanceof LocalGateway)
        {
            this.#addGatewayControllers(this.#runtime);
        }
        else if (this.#configuration.node !== undefined && this.#runtime instanceof LocalNode)
        {
            this.#addNodeControllers(this.#runtime);
        }
        else if (this.#configuration.proxy !== undefined && this.#runtime instanceof Proxy)
        {
            this.#addProxyControllers(this.#runtime);
        }
    }

    #addStandAloneControllers(standalone: Standalone, index: string): void
    {
        new HealthController(this.#app, standalone, this.#logger);
        new JitarController(this.#app);
        new ModulesController(this.#app, standalone, this.#serializer, this.#logger);
        new ProceduresController(this.#app, standalone, this.#logger);
        new RPCController(this.#app, standalone, this.#serializer, this.#logger);
        new AssetsController(this.#app, standalone, index, this.#logger);
    }

    #addRepositoryControllers(repository: LocalRepository, index: string): void
    {
        new JitarController(this.#app);
        new ModulesController(this.#app, repository, this.#serializer, this.#logger);
        new AssetsController(this.#app, repository, index, this.#logger);
    }

    #addGatewayControllers(gateway: LocalGateway): void
    {
        new NodesController(this.#app, gateway, this.#logger);
        new ProceduresController(this.#app, gateway, this.#logger);
        new RPCController(this.#app, gateway, this.#serializer, this.#logger);
    }

    #addNodeControllers(node: LocalNode): void
    {
        new HealthController(this.#app, node, this.#logger);
        new ProceduresController(this.#app, node, this.#logger);
        new RPCController(this.#app, node, this.#serializer, this.#logger);
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
            await runtime.import(setUpScript, ExecutionScopes.APPLICATION);
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
            await runtime.import(tearDownScript, ExecutionScopes.APPLICATION);
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
        const runtime = this.#getRuntime() as LocalNode | Standalone;

        if (runtime instanceof LocalNode === false
         && runtime instanceof Standalone === false)
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
