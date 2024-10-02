
import { HealthCheck } from 'jitar';

class DatabaseHealthCheck implements HealthCheck
{
    get name() { return 'database'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean>
    {
        // Check database connection
        return true;
    }
}

const instance = new DatabaseHealthCheck();

export default instance;
