
import RemoteWorker from '../../../src/services/RemoteWorker';

const WORKER_URL = 'http://localhost:80';

const remoteWorker = new RemoteWorker(WORKER_URL);
remoteWorker.procedureNames = new Set(['first', 'second']);

const WORKERS =
{
    REMOTE: remoteWorker
};

export { WORKERS, WORKER_URL };
