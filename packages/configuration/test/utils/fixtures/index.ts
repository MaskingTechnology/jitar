
import { ConfigurationReader, InvalidConfigurationFile } from '../../../src/utils';

import { FileManager } from '../../fixtures';

import { CONFIGURATIONS } from './configuration.fixture';
import { FILES } from './files.fixture';
import { FILENAMES } from './filenames.fixture';

const fileManager = new FileManager(FILES);
const reader = new ConfigurationReader(fileManager);

export { reader, FILENAMES, CONFIGURATIONS, InvalidConfigurationFile };
