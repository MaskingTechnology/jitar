
import { SourcingManager } from '@jitar/sourcing';

import InvalidHealthCheck from './errors/InvalidHealthCheck';
import HealthCheck from './interfaces/HealthCheck';

export default class HealthManager
{
    #sourcingManager: SourcingManager;
    #healthChecks: Map<string, HealthCheck> = new Map();

    constructor(sourcingManager: SourcingManager)
    {
        this.#sourcingManager = sourcingManager;
    }

    async importHealthCheck(filename: string): Promise<void>
    {
        const module = await this.#sourcingManager.import(filename);
        const healthCheck = module.default as HealthCheck;

        if (healthCheck?.isHealthy === undefined)
        {
            throw new InvalidHealthCheck(filename);
        }

        this.addHealthCheck(healthCheck as HealthCheck);
    }

    addHealthCheck(healthCheck: HealthCheck): void
    {
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
        const promises: Promise<{ name: string, isHealthy: boolean }>[] = [];

        for (const [name, healthCheck] of this.#healthChecks)
        {
            const promise = this.#executeHealthCheck(healthCheck)
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
