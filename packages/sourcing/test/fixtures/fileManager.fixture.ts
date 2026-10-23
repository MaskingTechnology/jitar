
import { FileManager } from '../../src';

import TestFileSystem from './TestFileSystem';
import { PATHS } from './paths.fixture';

const posixFileSystem = new TestFileSystem(PATHS.POSIX.CONFIGS.ROOT_PATH);
const posixFileManager = new FileManager(posixFileSystem, PATHS.POSIX.CONFIGS.BASE_LOCATION, PATHS.POSIX.CONFIGS.ROOT_PATH);

const windowsFileSystem = new TestFileSystem(PATHS.WINDOWS.CONFIGS.ROOT_PATH);
const windowsFileManager = new FileManager(windowsFileSystem, PATHS.WINDOWS.CONFIGS.BASE_LOCATION, PATHS.WINDOWS.CONFIGS.ROOT_PATH);

export { posixFileManager, windowsFileManager };
