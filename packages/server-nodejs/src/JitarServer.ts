
import express, { Express } from 'express';
import { Logger } from 'tslog';

import { HealthCheck, LocalGateway, LocalNode, LocalRepository, Middleware, ProcedureRuntime, Proxy, Runtime, RemoteClassLoader } from '@jitar/runtime';
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

import UnknownHealthCheck from './errors/UnknownHealthCheck.js';
import DuplicateHealthCheck from './errors/DuplicateHealthCheck.js';
import RuntimeNotAvailable from './errors/RuntimeNotAvailable.js';
import MiddlewareNotSupported from './errors/MiddlewareNotSupported.js';
import LogBuilder from './utils/LogBuilder.js';

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
    #runtime?: Runtime;
    #serializer: Serializer;
    #classLoader: ClassLoader;

    #options: ServerOptions;
    #configuration: RuntimeConfiguration;
    #logger: Logger<unknown>;

    #registeredHealthChecks: Map<string, HealthCheck> = new Map();

    constructor()
    {
        this.#classLoader = new RemoteClassLoader();
        this.#serializer = SerializerBuilder.build(this.#classLoader);

        this.#app = express();

        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));

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

        this.#addHealthChecks();

        await this.#startServer(url.port);

        this.#logger.info(`Server started and listening at port ${url.port}`);
    }

    registerHealthCheck(name: string, healthCheck: HealthCheck): void
    {
        if (this.#registeredHealthChecks.has(name))
        {
            throw new DuplicateHealthCheck(name);
        }

        this.#registeredHealthChecks.set(name, healthCheck);
    }

    addSerializer(serializer: ValueSerializer): void
    {
        this.#serializer.addSerializer(serializer);
    }

    addMiddleware(middleware: Middleware): void
    {
        if (this.#runtime === undefined)
        {
            throw new RuntimeNotAvailable();
        }

        if (!(this.#runtime instanceof ProcedureRuntime))
        {
            throw new MiddlewareNotSupported();
        }

        this.#runtime.addMiddleware(middleware);
    }

    #addHealthChecks(): void
    {
        if (this.#runtime === undefined)
        {
            throw new RuntimeNotAvailable();
        }

        if (this.#configuration.healthChecks === undefined)
        {
            return;
        }

        for (const name of this.#configuration.healthChecks)
        {
            const healthCheck = this.#registeredHealthChecks.get(name);

            if (healthCheck === undefined)
            {
                throw new UnknownHealthCheck(name);
            }

            this.#runtime.addHealthCheck(name, healthCheck);
        }
    }

    #addControllers(): void
    {
        if (this.#configuration.standalone !== undefined && this.#runtime instanceof Proxy)
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

    #addStandAloneControllers(proxy: Proxy, index: string): void
    {
        new HealthController(this.#app, proxy, this.#logger);
        new JitarController(this.#app);
        new ModulesController(this.#app, proxy, this.#serializer, this.#logger);
        new ProceduresController(this.#app, proxy, this.#logger);
        new RPCController(this.#app, proxy, this.#serializer, this.#logger);
        new AssetsController(this.#app, proxy, index, this.#logger);
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

    async #startServer(port: string): Promise<void>
    {
        return new Promise(resolve => { this.#app.listen(port, resolve); });
    }

    #printStartupMessage(): void
    {
        console.log(STARTUP_MESSAGE);
    }
}
