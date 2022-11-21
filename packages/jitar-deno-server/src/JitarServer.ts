
import { Server as OvernightServer } from 'npm:@overnightjs/core@^1.7.6';
import bodyParser from 'npm:body-parser@^1.20.1';
import { Logger, TLogLevelName } from 'npm:tslog@^3.3.3';

import { HealthCheck, LocalGateway, LocalNode, LocalRepository, Proxy, Runtime } from 'npm:jitar@^0.2.0';

import RuntimeConfigurationLoader from './utils/RuntimeConfigurationLoader.ts';
import RuntimeConfigurator from './utils/RuntimeConfigurator.ts';
import ServerOptionsReader from './utils/ServerOptionsReader.ts';

import AssetsController from './controllers/AssetsController.ts';
import HealthController from './controllers/HealthController.ts';
import JitarController from './controllers/JitarController.ts';
import ModulesController from './controllers/ModulesController.ts';
import NodesController from './controllers/NodesController.ts';
import ProceduresController from './controllers/ProceduresController.ts';
import ProxyController from './controllers/ProxyController.ts';
import RPCController from './controllers/RPCController.ts';

import RuntimeConfiguration from './configuration/RuntimeConfiguration.ts';
import RuntimeDefaults from './definitions/RuntimeDefaults.ts';

import RuntimeNotAvaiable from './errors/RuntimeNotAvaiable.ts';

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

    async start(): Promise<void>
    {
        console.log(STARTUP_MESSAGE);

        const options = await ServerOptionsReader.read();
        const configuration = await RuntimeConfigurationLoader.load(options.config);
        const runtime = await RuntimeConfigurator.configure(configuration);

        const logger = this.#createLogger(options.loglevel);

        this.#addControllers(configuration, runtime, logger);

        const url = new URL(configuration.url ?? RuntimeDefaults.URL);

        await this.#startServer(url.port);

        this.#runtime = runtime;

        logger.info(`Server started and listening at port ${url.port}`);
    }

    addHealthCheck(name: string, healthCheck: HealthCheck): void
    {
        if (this.#runtime === undefined)
        {
            throw new RuntimeNotAvaiable();
        }

        this.#runtime.addHealthCheck(name, healthCheck);
    }

    #createLogger(level: string): Logger
    {
        return new Logger(
            {
                displayFilePath: 'hidden',
                minLevel: level as TLogLevelName
            });
    }

    #addControllers(configuration: RuntimeConfiguration, runtime: Runtime, logger: Logger): void
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

    #addStandAloneControllers(proxy: Proxy, logger: Logger, index: string): void
    {
        super.addControllers(new HealthController(this.app, proxy, logger));
        super.addControllers(new JitarController(this.app));
        super.addControllers(new ModulesController(this.app, proxy, logger));
        super.addControllers(new ProceduresController(this.app, proxy, logger));
        super.addControllers(new RPCController(this.app, proxy, logger, true));
        super.addControllers(new AssetsController(this.app, proxy, index, logger));
    }

    #addRepositoryControllers(repository: LocalRepository, logger: Logger, index: string): void
    {
        super.addControllers(new JitarController(this.app));
        super.addControllers(new ModulesController(this.app, repository, logger));
        super.addControllers(new AssetsController(this.app, repository, index, logger));
    }

    #addGatewayControllers(gateway: LocalGateway, logger: Logger): void
    {
        super.addControllers(new NodesController(this.app, gateway, logger));
        super.addControllers(new ProceduresController(this.app, gateway, logger));
        super.addControllers(new RPCController(this.app, gateway, logger, false));
    }

    #addNodeControllers(node: LocalNode, logger: Logger): void
    {
        super.addControllers(new HealthController(this.app, node, logger));
        super.addControllers(new ProceduresController(this.app, node, logger));
        super.addControllers(new RPCController(this.app, node, logger, true));
    }

    #addProxyControllers(proxy: Proxy, logger: Logger): void
    {
        super.addControllers(new ProxyController(this.app, proxy, logger));
    }

    async #startServer(port: string): Promise<void>
    {
        return new Promise(resolve => { this.app.listen(port, resolve); });
    }
}
