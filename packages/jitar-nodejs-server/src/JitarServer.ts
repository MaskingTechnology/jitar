
import { Server as OvernightServer } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Logger } from 'tslog';

import { HealthCheck, LocalGateway, LocalNode, LocalRepository, Middleware, Proxy, Runtime } from 'jitar';

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

import RuntimeNotAvaiable from './errors/RuntimeNotAvaiable.js';
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

export default class JitarServer extends OvernightServer
{
    #runtime?: Runtime;

    constructor()
    {
        super(false);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    get runtime(): Runtime | undefined
    {
        return this.#runtime;
    }

    async start(): Promise<void>
    {
        console.log(STARTUP_MESSAGE);

        const options = await ServerOptionsReader.read();
        const configuration = await RuntimeConfigurationLoader.load(options.config);
        const runtime = await RuntimeConfigurator.configure(configuration);

        const logger = LogBuilder.build(options.loglevel);

        this.#addControllers(configuration, runtime, logger);

        const url = new URL(configuration.url ?? RuntimeDefaults.URL);

        await this.#startServer(url.port);

        this.#runtime = runtime;

        logger.info(`Server started and listening at port ${url.port}`);
    }

    #addControllers(configuration: RuntimeConfiguration, runtime: Runtime, logger: Logger<unknown>): void
    {
        if (configuration.standalone !== undefined && runtime instanceof Proxy)
        {
            const index = configuration.standalone.index ?? RuntimeDefaults.INDEX;

            this.#addStandAloneControllers(runtime, logger, index);
        }
        else if (configuration.repository !== undefined && runtime instanceof LocalRepository)
        {
            const index = configuration.repository.index ?? RuntimeDefaults.INDEX;

            this.#addRepositoryControllers(runtime, logger, index);
        }
        else if (configuration.gateway !== undefined && runtime instanceof LocalGateway)
        {
            this.#addGatewayControllers(runtime, logger);
        }
        else if (configuration.node !== undefined && runtime instanceof LocalNode)
        {
            this.#addNodeControllers(runtime, logger);
        }
        else if (configuration.proxy !== undefined && runtime instanceof Proxy)
        {
            this.#addProxyControllers(runtime, logger);
        }
    }

    #addStandAloneControllers(proxy: Proxy, logger: Logger<unknown>, index: string): void
    {
        super.addControllers(new HealthController(proxy, logger));
        super.addControllers(new JitarController(this.app));
        super.addControllers(new ModulesController(proxy, logger));
        super.addControllers(new ProceduresController(proxy, logger));
        super.addControllers(new RPCController(proxy, logger, true));
        super.addControllers(new AssetsController(this.app, proxy, index, logger));
    }

    #addRepositoryControllers(repository: LocalRepository, logger: Logger<unknown>, index: string): void
    {
        super.addControllers(new JitarController(this.app));
        super.addControllers(new ModulesController(repository, logger));
        super.addControllers(new AssetsController(this.app, repository, index, logger));
    }

    #addGatewayControllers(gateway: LocalGateway, logger: Logger<unknown>): void
    {
        super.addControllers(new NodesController(gateway, logger));
        super.addControllers(new ProceduresController(gateway, logger));
        super.addControllers(new RPCController(gateway, logger, false));
    }

    #addNodeControllers(node: LocalNode, logger: Logger<unknown>): void
    {
        super.addControllers(new HealthController(node, logger));
        super.addControllers(new ProceduresController(node, logger));
        super.addControllers(new RPCController(node, logger, true));
    }

    #addProxyControllers(proxy: Proxy, logger: Logger<unknown>): void
    {
        super.addControllers(new ProxyController(this.app, proxy, logger));
    }

    async #startServer(port: string): Promise<void>
    {
        return new Promise(resolve => { this.app.listen(port, resolve); });
    }
}
