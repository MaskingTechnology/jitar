
import { SourcingManager } from '../../src';

import { posixFileManager } from './fileManager.fixture';
import { posixImportManager } from './importManager.fixture';

export default class TestSourcingManager extends SourcingManager
{
    constructor()
    {
        super(posixFileManager, posixImportManager);
    }

    // eslint-disable-next-line no-unused-vars
    fork(location: string): TestSourcingManager
    {
        return this;
    }
}
