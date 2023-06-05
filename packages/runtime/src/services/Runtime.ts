
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
        const promises: Promise<{ name: string, isHealthy: boolean }>[] = [];

        for (const [name, healthCheck] of this.#healthChecks)
        {
            const promise = healthCheck.isHealthy()
                .then(result => ({ name, isHealthy: result }))
                .catch(() => ({ name, isHealthy: false }));

            promises.push(promise);
        }

        const healthChecks = new Map<string, boolean>();

        return Promise.allSettled(promises)
            .then(results => results.forEach(result =>
            {
                result.status === 'fulfilled'
                    ? healthChecks.set(result.value.name, result.value.isHealthy)
                    : healthChecks.set(result.reason.name, false);
            }))
            .then(() => healthChecks);
    }
}
