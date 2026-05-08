
import { Validator } from '@jitar/validation';

import { ServerConfigurationBuilder, ServerConfigurationInvalid } from '../../../src/server';
import { ConfigurationReader } from '../../../src/utils';

import { FileManager } from '../../fixtures';

import { FILES } from './files.fixture';
import { FILENAMES } from './filenames.fixture';
import { CONFIGURATIONS } from './configuration.fixture';
import { VALIDATION_RESULT } from './validation.fixture';

const fileManager = new FileManager(FILES);
const configurationReader = new ConfigurationReader(fileManager);
const validator = new Validator();

const configurationBuilder = new ServerConfigurationBuilder(configurationReader, validator);

export { configurationBuilder, CONFIGURATIONS, ServerConfigurationInvalid, VALIDATION_RESULT, FILENAMES };
