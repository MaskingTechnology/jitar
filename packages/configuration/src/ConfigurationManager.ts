
import { Validator } from '@jitar/validation';

import { RuntimeConfiguration, RuntimeConfigurationBuilder } from './runtime';
import { ServerConfiguration, ServerConfigurationBuilder } from './server';
import { ConfigurationReader } from './utils';

const DEFAULT_ROOT_PATH = './';

export default class ConfigurationManager
{
    #runtimeConfigurationBuilder: RuntimeConfigurationBuilder;
    #serverConfigurationBuilder : ServerConfigurationBuilder;

    constructor(rootPath = DEFAULT_ROOT_PATH)
    {
        const reader = new ConfigurationReader(rootPath);
        const validator = new Validator();

        this.#runtimeConfigurationBuilder = new RuntimeConfigurationBuilder(reader, validator);
        this.#serverConfigurationBuilder = new ServerConfigurationBuilder(reader, validator);
    }

    configureRuntime(filename?: string): Promise<RuntimeConfiguration>
    {
        return this.#runtimeConfigurationBuilder.build(filename);
    }

    configureServer(filename: string): Promise<ServerConfiguration>
    {
        return this.#serverConfigurationBuilder.build(filename);
    }
}
