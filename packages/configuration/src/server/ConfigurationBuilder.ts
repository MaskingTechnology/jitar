
import type { ConfigurationReader, ConfigurationValidator } from '../utils';

import ServerConfiguration, { validationScheme } from './definitions/ServerConfiguration';
import ServerConfigurationInvalid from './errors/ServerConfigurationInvalid';

export default class ConfigurationBuilder
{
    #reader: ConfigurationReader;
    #validator: ConfigurationValidator;

    constructor(reader: ConfigurationReader, validator: ConfigurationValidator)
    {
        this.#reader = reader;
        this.#validator = validator;
    }

    async build(filename: string): Promise<ServerConfiguration>
    {
        const configuration = await this.#reader.read(filename) as ServerConfiguration;
        const validation = this.#validator.validate(configuration, validationScheme);

        if (validation.valid === false)
        {
            throw new ServerConfigurationInvalid(validation);
        }

        return configuration;
    }
}
