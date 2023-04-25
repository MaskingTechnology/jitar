
import HealthCheck from '../../../src/interfaces/HealthCheck';

class HealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return true; }
}

class UnhealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return false; }
}

const HEALTH_CHECKS =
{
    GOOD: new HealthyCheck(),
    BAD: new UnhealthyCheck()
};

export { HEALTH_CHECKS };
