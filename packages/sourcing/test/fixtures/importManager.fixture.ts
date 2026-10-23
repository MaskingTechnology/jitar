
import { LocalImportManager } from '../../src/modules';

import { posixFileManager } from './fileManager.fixture';

const posixImportManager = new LocalImportManager(posixFileManager);

export { posixImportManager };
