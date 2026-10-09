
import LocalRepository from '../../../src/repository/LocalRepository';

import { healthManager } from './healthManager.fixture';
import { sourcingManager } from './sourcingManager.fixture';

const url = 'http://localhost:80';
const assets = new Set(['index.html', 'logo.png', 'dir/index.html']);
const indexFilename = 'index.html';
const fallback = 'index.html';

const fileRepository = new LocalRepository({ url, assets, healthManager, sourcingManager });
const webRepository = new LocalRepository({ url, assets, healthManager, sourcingManager, indexFilename, fallback });

export const LOCAL_REPOSITORIES =
{
    FILE: fileRepository,
    WEB: webRepository
};
