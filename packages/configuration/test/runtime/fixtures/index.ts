
import { Validator } from '@jitar/validation';

import { RuntimeConfigurationBuilder } from '../../../src/runtime';
import RuntimeConfigurationInvalid from '../../../src/runtime/errors/RuntimeConfigurationInvalid';
import { ConfigurationReader } from '../../../src/utils';

import { FileManager } from '../../fixtures';

import { FILES } from './files.fixture';
import { FILENAMES } from './filenames.fixture';
import { CONFIGURATIONS } from './configuration.fixture';
import { VALIDATION_RESULT } from './validation.fixture';

const fileManager = new FileManager(FILES);
const configurationReader = new ConfigurationReader(fileManager);
const validator = new Validator();

const configurationBuilder = new RuntimeConfigurationBuilder(configurationReader, validator);

export { configurationBuilder, FILENAMES, CONFIGURATIONS, RuntimeConfigurationInvalid, VALIDATION_RESULT };
