
import HealthCheck from '../interfaces/HealthCheck.js';

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
        const promises: Promise<boolean>[] = [];

        for (const healthCheck of this.#healthChecks.values())
        {
            const promise = healthCheck.isHealthy();

            promises.push(promise);
        }

        return Promise.all(promises)
            .then(results => results.every(result => result))
            .catch(() => false);
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const keys = this.#healthChecks.keys();
        const promises: Promise<[string, boolean]>[] = [];

        for (const [name, healthCheck] of this.#healthChecks.entries())
        {
            const promise = healthCheck.isHealthy()
                .then(result => [name, result] as [string, boolean]);

            promises.push(promise);
        }

        const healthChecks = new Map<string, boolean>();

        return Promise.allSettled(promises)
            .then(results => results.forEach(result =>
            {
                if (result.status === 'fulfilled')
                {
                    const [name, value] = result.value;
                    healthChecks.set(name, value);
                }
            }
            ))
            .then(() => 
            {
                for (const key of keys)
                {
                    if (!healthChecks.has(key))
                    {
                        healthChecks.set(key, false);
                    }
                }
            })
            .then(() => healthChecks);
    }
}
