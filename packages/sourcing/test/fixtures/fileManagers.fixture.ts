
import { FileManager } from '../../src';

import TestFileSystem from './TestFileSystem';
import PATHS from './paths.fixture';

const fileSystem = new TestFileSystem(PATHS.CONFIGS.ROOT_PATH);
const fileManager = new FileManager(PATHS.CONFIGS.BASE_LOCATION, fileSystem);

export { fileManager };
