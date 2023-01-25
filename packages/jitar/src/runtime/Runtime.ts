
import HealthCheck from './interfaces/HealthCheck.js';

export default abstract class Runtime
{
    #url?: string;
    #healthChecks: Map<string, HealthCheck> = new Map();
    
    constructor(url?: string)
    {
        this.#url = url;
    }

    get url() { return this.#url; }

    addHealthCheck(name: string, healthCheck: HealthCheck): void
    {
        this.#healthChecks.set(name, healthCheck);
    }

    async isHealthy(): Promise<boolean>
    {
        for (const healthCheck of this.#healthChecks.values())
        {
            if (await healthCheck.isHealthy() === false)
            {
                return false;
            }
        }

        return true;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const health: Map<string, boolean> = new Map();

        for (const [name, healthCheck] of this.#healthChecks)
        {
            const healthy = await healthCheck.isHealthy();

            health.set(name, healthy);
        }

        return health;
    }
}
