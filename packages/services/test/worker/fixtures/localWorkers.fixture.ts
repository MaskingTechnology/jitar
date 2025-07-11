
import LocalWorker from '../../../src/worker/LocalWorker';

import { executionManager } from './executionManager.fixture';
import { healthManager } from './healthManager.fixture';
import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.TRUST_KEY;

const publicWorker = new LocalWorker({ url, executionManager, healthManager });
const protectedWorker = new LocalWorker({ url, trustKey, executionManager, healthManager });

export const LOCAL_WORKERS =
{
    PUBLIC: publicWorker,
    PROTECTED: protectedWorker
};
