
import HealthCheck from '../../../src/interfaces/HealthCheck';

class HealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return true; }
}

class UnhealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return false; }
}

class ErrorHealthCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { throw new Error('ErrorHealthCheck'); }
}

const HEALTH_CHECKS =
{
    GOOD: new HealthyCheck(),
    BAD: new UnhealthyCheck(),
    ERROR: new ErrorHealthCheck()
};

export { HEALTH_CHECKS };
