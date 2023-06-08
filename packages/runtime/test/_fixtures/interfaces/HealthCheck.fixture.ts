
import HealthCheck from '../../../src/interfaces/HealthCheck';

class HealthyCheck implements HealthCheck
{
    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { return true; }
}

class UnhealthyCheck implements HealthCheck
{
    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { return false; }
}

class ErrorHealthCheck implements HealthCheck
{
    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { throw new Error('ErrorHealthCheck'); }
}

class TimedOutHealthCheck implements HealthCheck
{
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
    get timeout() { return 5000; }

    async isHealthy(): Promise<boolean>
    {
        return new Promise((resolve) =>
        {
            setTimeout(resolve, 50);
        }).then(() => true);
    }
}

const HEALTH_CHECKS =
{
    GOOD: new HealthyCheck(),
    BAD: new UnhealthyCheck(),
    ERROR: new ErrorHealthCheck(),
    TIMEDOUT: new TimedOutHealthCheck(),
    INTIME: new InTimeHealthCheck()
};

export { HEALTH_CHECKS };
