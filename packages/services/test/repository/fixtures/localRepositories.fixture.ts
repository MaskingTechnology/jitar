
import LocalRepository from '../../../src/repository/LocalRepository';

import { sourcingManager } from './sourcingManager.fixture';

const url = 'http://localhost:80';
const assets = new Set(['index.html', 'logo.png']);
const indexFilename = 'index.html';
const serveIndexOnNotFound = true;

const fileRepository = new LocalRepository({ url, assets, sourcingManager });
const webRepository = new LocalRepository({ url, assets, sourcingManager, indexFilename, serveIndexOnNotFound });

export const LOCAL_REPOSITORIES =
{
    FILE: fileRepository,
    WEB: webRepository
};
