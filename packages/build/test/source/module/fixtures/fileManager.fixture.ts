
import { FileManager } from '@jitar/sourcing';

import TestFileSystem from './TestFileSystem';
import { PATHS } from './paths.fixture';

const fileSystem = new TestFileSystem(PATHS.ROOT, PATHS.DIRECTORIES);
const fileManager = new FileManager(fileSystem, '', PATHS.ROOT);

export { fileManager };
