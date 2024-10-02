
import { ExecutionScope } from '../../../src/definitions/ExecutionScope';
import Runtime from '../../../src/services/Runtime';
import Module from '../../../src/types/Module';

import { HEALTH_CHECKS } from '../interfaces/HealthCheck.fixture';

class TestRuntime extends Runtime
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async import(url: string, scope: ExecutionScope): Promise<Module>
    {
        return {};
    }

    async start(): Promise<void> { }

    async stop(): Promise<void> { }
}

const goodRuntime = new TestRuntime();
goodRuntime.addHealthCheck(HEALTH_CHECKS.GOOD);

const badRuntime = new TestRuntime();
badRuntime.addHealthCheck(HEALTH_CHECKS.BAD);

const errorRuntime = new TestRuntime();
errorRuntime.addHealthCheck(HEALTH_CHECKS.ERROR);

const timeoutRuntime = new TestRuntime();
timeoutRuntime.addHealthCheck(HEALTH_CHECKS.TIMEDOUT);

const inTimeRuntime = new TestRuntime();
inTimeRuntime.addHealthCheck(HEALTH_CHECKS.INTIME);

const RUNTIMES =
{
    GOOD: goodRuntime,
    BAD: badRuntime,
    ERROR: errorRuntime,
    TIMEDOUT: timeoutRuntime,
    INTIME: inTimeRuntime
};

export { RUNTIMES };
