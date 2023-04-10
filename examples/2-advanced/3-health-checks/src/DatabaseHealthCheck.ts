
/*
 * Health checks are used to determine if a node is healthy or not.
 * They are used by the gateway to determine if a node still can be used.
 * 
 * A health check is a class that implements the HealthCheck interface.
 * The interface has a single function called isHealthy() that returns a boolean.
 * 
 * Because the function is async it can perform any kind of check
 * (e.g. database avaialability).
 */

import { HealthCheck } from 'jitar-runtime';

export default class DatabaseHealthCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean>
    {
        // Check database connection
        return true;
    }
}
