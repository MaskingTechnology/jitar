
import RemoteWorker from '../../../src/worker/RemoteWorker';
import States from '../../../src/common/definitions/States';

import { VALUES } from './values.fixture';
import { REMOTES } from './remotes.fixture';

class HealthyWorker extends RemoteWorker
{
    async isHealthy(): Promise<boolean>
    {
        return true;    
    }
}

class UnhealthyWorker extends RemoteWorker
{
    async isHealthy(): Promise<boolean>
    {
        return false;    
    }
}

const url = VALUES.URL;
const remote = REMOTES.DUMMY;

const noProcedureNames = new Set<string>();
const emptyWorker = new RemoteWorker({ url, procedureNames: noProcedureNames, remote });

const trustedWorker = new RemoteWorker({ url, procedureNames: noProcedureNames, remote, trustKey: VALUES.VALID_TRUST_KEY });
const untrustedWorker = new RemoteWorker({ url, procedureNames: noProcedureNames, remote, trustKey: VALUES.INVALID_TRUST_KEY });

const firstProcedureNames = new Set<string>(['first']);
const firstWorker = new RemoteWorker({ url, procedureNames: firstProcedureNames, remote });
await firstWorker.reportState(States.AVAILABLE);

const secondProcedureNames = new Set<string>(['first', 'second']);
const secondWorker = new RemoteWorker({ url, procedureNames: secondProcedureNames, remote });
await secondWorker.reportState(States.AVAILABLE);

const healthyWorker = new HealthyWorker({ url, procedureNames: noProcedureNames, remote });
await healthyWorker.reportState(States.AVAILABLE);

const unhealthyWorker = new UnhealthyWorker({ url, procedureNames: noProcedureNames, remote });
await unhealthyWorker.reportState(States.STOPPED);

export const REMOTE_WORKERS =
{
    EMPTY: emptyWorker,
    TRUSTED: trustedWorker,
    UNTRUSTED: untrustedWorker,
    FIRST: firstWorker,
    SECOND: secondWorker,
    HEALTHY: healthyWorker,
    UNHEALTHY: unhealthyWorker
};
