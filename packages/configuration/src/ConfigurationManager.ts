
import { Validator } from '@jitar/validation';
import { LocalFileManager } from '@jitar/sourcing';

import { EnvironmentConfigurator } from './environment';
import { RuntimeConfiguration, RuntimeConfigurationBuilder } from './runtime';
import { ServiceConfiguration, ServiceConfigurationBuilder } from './service';
import { ConfigurationReader } from './utils';

const DEFAULT_ROOT_PATH = './';
const DEFAULT_ENVIRONMENT_FILE = '.env';

export default class ConfigurationManager
{
    readonly #environmentConfigurator: EnvironmentConfigurator;
    readonly #runtimeConfigurationBuilder: RuntimeConfigurationBuilder;
    readonly #serviceConfigurationBuilder: ServiceConfigurationBuilder;

    constructor(rootPath: string = DEFAULT_ROOT_PATH)
    {
        const fileManager = new LocalFileManager(rootPath);
        const reader = new ConfigurationReader(fileManager);
        const validator = new Validator();

        this.#environmentConfigurator = new EnvironmentConfigurator(fileManager);
        this.#runtimeConfigurationBuilder = new RuntimeConfigurationBuilder(reader, validator);
        this.#serviceConfigurationBuilder = new ServiceConfigurationBuilder(reader, validator);
    }

    configureEnvironment(filename: string = DEFAULT_ENVIRONMENT_FILE): Promise<void>
    {
        return this.#environmentConfigurator.configure(filename);
    }

    getRuntimeConfiguration(filename?: string): Promise<RuntimeConfiguration>
    {
        return this.#runtimeConfigurationBuilder.build(filename);
    }

    getServiceConfiguration(filename: string): Promise<ServiceConfiguration>
    {
        return this.#serviceConfigurationBuilder.build(filename);
    }
}
