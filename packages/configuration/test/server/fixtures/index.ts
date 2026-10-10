
import { Validator } from '@jitar/validation';

import { ServiceConfigurationBuilder, ServiceConfigurationInvalid } from '../../../src/service';
import { ConfigurationReader } from '../../../src/utils';

import { FileManager } from '../../fixtures';

import { FILES } from './files.fixture';
import { FILENAMES } from './filenames.fixture';
import { CONFIGURATIONS } from './configuration.fixture';
import { VALIDATION_RESULT } from './validation.fixture';

const fileManager = new FileManager(FILES);
const configurationReader = new ConfigurationReader(fileManager);
const validator = new Validator();

const configurationBuilder = new ServiceConfigurationBuilder(configurationReader, validator);

export { configurationBuilder, CONFIGURATIONS, ServiceConfigurationInvalid, VALIDATION_RESULT, FILENAMES };
