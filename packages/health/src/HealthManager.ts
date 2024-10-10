
import InvalidHealthCheck from './errors/InvalidHealthCheck';
import type HealthCheck from './interfaces/HealthCheck';

type HealthCheckResult =
{
    name: string;
    isHealthy: boolean;
}

export default class HealthManager
{
    #healthChecks = new Map<string, HealthCheck>();

    addHealthCheck(healthCheck: HealthCheck): void
    {
        if (healthCheck.isHealthy === undefined)
        {
            throw new InvalidHealthCheck();
        }

        this.#healthChecks.set(healthCheck.name, healthCheck);
    }

    clearHealthChecks(): void
    {
        this.#healthChecks.clear();
    }

    async isHealthy(): Promise<boolean>
    {
        const promises: Promise<boolean>[] = [];

        for (const healthCheck of this.#healthChecks.values())
        {
            const promise = this.#executeHealthCheck(healthCheck);

            promises.push(promise);
        }

        return Promise.all(promises)
            .then(results => results.every(result => result))
            .catch(() => false);
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const promises: Promise<{ name: string, isHealthy: boolean; }>[] = [];

        for (const [name, healthCheck] of this.#healthChecks)
        {
            const promise = this.#executeHealthCheck(healthCheck)
                .then(result => ({ name, isHealthy: result }))
                .catch(() => ({ name, isHealthy: false }));

            promises.push(promise);
        }

        const healthChecks = new Map<string, boolean>();

        return Promise.allSettled(promises)
            .then(results => results.forEach(result => this.#handleHealthCheckResult(result, healthChecks)))
            .then(() => healthChecks);
    }

    #handleHealthCheckResult(result: PromiseSettledResult<HealthCheckResult>, healthChecks: Map<string, boolean>): void
    {
        if (result.status === 'fulfilled')
        {
            healthChecks.set(result.value.name, result.value.isHealthy);
        }
        else
        {
            healthChecks.set(result.reason.name, false);
        }
    }

    async #executeHealthCheck(healthCheck: HealthCheck): Promise<boolean>
    {
        const health = healthCheck.isHealthy();
        const milliseconds = healthCheck.timeout;

        if (milliseconds === undefined)
        {
            return health;
        }

        const timeout = new Promise((resolve) => 
        {
            setTimeout(resolve, milliseconds);
        }).then(() => false);

        return Promise.race([timeout, health]);
    }
}
