
import type { ConfigurationReader, ConfigurationValidator } from '../utils';

import RuntimeConfiguration, { DefaultValues, validationScheme } from './definitions/RuntimeConfiguration';
import RuntimeConfigurationInvalid from './errors/RuntimeConfigurationInvalid';

export default class ConfigurationBuilder
{
    #reader: ConfigurationReader;
    #validator: ConfigurationValidator;

    constructor(reader: ConfigurationReader, validator: ConfigurationValidator)
    {
        this.#reader = reader;
        this.#validator = validator;
    }

    async build(filename: string = DefaultValues.FILENAME): Promise<RuntimeConfiguration>
    {
        const configuration = await this.#reader.read(filename) as RuntimeConfiguration;
        const validation = this.#validator.validate(configuration, validationScheme);

        if (validation.valid === false)
        {
            throw new RuntimeConfigurationInvalid(validation);
        }

        configuration.source ??= DefaultValues.SOURCE;
        configuration.target ??= DefaultValues.TARGET;

        return configuration;
    }
}