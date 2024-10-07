
/* eslint-disable @typescript-eslint/class-literal-property-style */
import HealthCheck from '../../src/interfaces/HealthCheck';

class HealthyCheck implements HealthCheck
{
    get name() { return 'good'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { return true; }
}

class UnhealthyCheck implements HealthCheck
{
    get name() { return 'bad'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { return false; }
}

class ErrorHealthCheck implements HealthCheck
{
    get name() { return 'error'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { throw new Error('ErrorHealthCheck'); }
}

class TimedOutHealthCheck implements HealthCheck
{
    get name() { return 'timedOut'; }

    get timeout() { return 50; }

    async isHealthy(): Promise<boolean>
    {
        return new Promise((resolve) =>
        {
            setTimeout(resolve, 5000);
        }).then(() => true);
    }
}

class InTimeHealthCheck implements HealthCheck
{
    get name() { return 'inTime'; }
    
    get timeout() { return 5000; }

    async isHealthy(): Promise<boolean>
    {
        return new Promise((resolve) =>
        {
            setTimeout(resolve, 50);
        }).then(() => true);
    }
}

export const HEALTH_CHECKS =
{
    GOOD: new HealthyCheck(),
    BAD: new UnhealthyCheck(),
    ERROR: new ErrorHealthCheck(),
    TIMEDOUT: new TimedOutHealthCheck(),
    INTIME: new InTimeHealthCheck()
};
