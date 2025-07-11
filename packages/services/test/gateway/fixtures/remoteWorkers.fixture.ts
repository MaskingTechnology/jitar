
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
firstWorker.state = States.AVAILABLE;

const secondProcedureNames = new Set<string>(['first', 'second']);
const secondWorker = new RemoteWorker({ url, procedureNames: secondProcedureNames, remote });
secondWorker.state = States.AVAILABLE;

const healthyWorker = new HealthyWorker({ url, procedureNames: noProcedureNames, remote });
healthyWorker.state = States.AVAILABLE;

const unhealthyWorker = new UnhealthyWorker({ url, procedureNames: noProcedureNames, remote });
unhealthyWorker.state = States.STOPPED;

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
