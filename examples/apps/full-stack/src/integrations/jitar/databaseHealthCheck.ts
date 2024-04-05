
import { HealthCheck } from 'jitar';

import Database from '../database/Database';

class DatabaseHealthCheck implements HealthCheck
{
    get name() { return 'database'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean>
    {
        return Database.connected;
    }
}

export default new DatabaseHealthCheck();
