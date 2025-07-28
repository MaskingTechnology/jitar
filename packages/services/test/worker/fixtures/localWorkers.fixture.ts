
import LocalWorker from '../../../src/worker/LocalWorker';

import { executionManager } from './executionManager.fixture';
import { healthManager } from './healthManager.fixture';
import { scheduleManager } from './scheduleManager.fixture';
import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.TRUST_KEY;

const publicWorker = new LocalWorker({ url, executionManager, healthManager, scheduleManager });
const protectedWorker = new LocalWorker({ url, trustKey, executionManager, healthManager, scheduleManager });

export const LOCAL_WORKERS =
{
    PUBLIC: publicWorker,
    PROTECTED: protectedWorker
};
