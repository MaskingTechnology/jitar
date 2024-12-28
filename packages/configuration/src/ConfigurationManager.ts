
import { Validator } from '@jitar/validation';
import { FileManager } from '@jitar/sourcing';

import { EnvironmentConfigurator } from './environment';
import { RuntimeConfiguration, RuntimeConfigurationBuilder } from './runtime';
import { ServerConfiguration, ServerConfigurationBuilder } from './server';
import { ConfigurationReader } from './utils';

const DEFAULT_ROOT_PATH = './';
const DEFAULT_ENVIRONMENT_FILE = '.env';

export default class ConfigurationManager
{
    readonly #environmentConfigurator: EnvironmentConfigurator;
    readonly #runtimeConfigurationBuilder: RuntimeConfigurationBuilder;
    readonly #serverConfigurationBuilder : ServerConfigurationBuilder;

    constructor(rootPath: string = DEFAULT_ROOT_PATH)
    {
        const fileManager = new FileManager(rootPath);
        const reader = new ConfigurationReader(fileManager);
        const validator = new Validator();

        this.#environmentConfigurator = new EnvironmentConfigurator();
        this.#runtimeConfigurationBuilder = new RuntimeConfigurationBuilder(reader, validator);
        this.#serverConfigurationBuilder = new ServerConfigurationBuilder(reader, validator);
    }

    configureEnvironment(filename: string = DEFAULT_ENVIRONMENT_FILE): Promise<void>
    {
        return this.#environmentConfigurator.configure(filename);
    }

    getRuntimeConfiguration(filename?: string): Promise<RuntimeConfiguration>
    {
        return this.#runtimeConfigurationBuilder.build(filename);
    }

    getServerConfiguration(filename: string): Promise<ServerConfiguration>
    {
        return this.#serverConfigurationBuilder.build(filename);
    }
}
