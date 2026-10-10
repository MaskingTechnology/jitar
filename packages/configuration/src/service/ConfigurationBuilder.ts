
import type { Validator } from '@jitar/validation';

import type { ConfigurationReader } from '../utils';

import ServiceConfiguration, { validationScheme } from './definitions/ServiceConfiguration';
import ServiceConfigurationInvalid from './errors/ServiceConfigurationInvalid';

export default class ConfigurationBuilder
{
    readonly #reader: ConfigurationReader;
    readonly #validator: Validator;

    constructor(reader: ConfigurationReader, validator: Validator)
    {
        this.#reader = reader;
        this.#validator = validator;
    }

    async build(filename: string): Promise<ServiceConfiguration>
    {
        const configuration = await this.#reader.read(filename) as ServiceConfiguration;
        const validation = this.#validator.validate(configuration, validationScheme);

        if (validation.valid === false)
        {
            throw new ServiceConfigurationInvalid(filename, validation);
        }

        configuration.meta =
        {
            root: this.#reader.getRootLocation(),
            configFile: filename
        };

        return configuration;
    }
}
