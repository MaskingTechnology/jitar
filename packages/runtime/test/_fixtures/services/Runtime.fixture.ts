
import Runtime from '../../../src/services/Runtime';
import { HEALTH_CHECKS } from '../interfaces/HealthCheck.fixture';

class TestRuntime extends Runtime
{

}

const goodRuntime = new TestRuntime();
goodRuntime.addHealthCheck('good', HEALTH_CHECKS.GOOD);

const badRuntime = new TestRuntime();
badRuntime.addHealthCheck('bad', HEALTH_CHECKS.BAD);

const errorRuntime = new TestRuntime();
errorRuntime.addHealthCheck('error', HEALTH_CHECKS.ERROR);

const timeoutRuntime = new TestRuntime();
timeoutRuntime.addHealthCheck('timedOut', HEALTH_CHECKS.TIMEDOUT);

const inTimeRuntime = new TestRuntime();
inTimeRuntime.addHealthCheck('inTime', HEALTH_CHECKS.INTIME);

const RUNTIMES =
{
    GOOD: goodRuntime,
    BAD: badRuntime,
    ERROR: errorRuntime,
    TIMEDOUT: timeoutRuntime,
    INTIME: inTimeRuntime
};

export { RUNTIMES };
