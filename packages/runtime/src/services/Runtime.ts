
import { ExecutionScope, ExecutionScopes } from '../definitions/ExecutionScope.js';
import InvalidHealthCheck from '../errors/InvalidHealthCheck.js';
import HealthCheck from '../interfaces/HealthCheck.js';
import Module from '../types/Module.js';

export default abstract class Runtime
{
    #url?: string;
    #healthChecks: Map<string, HealthCheck> = new Map();

    constructor(url?: string)
    {
        this.#url = url;
    }

    get url() { return this.#url; }

    abstract import(url: string, scope: ExecutionScope): Promise<Module>;

    abstract start(): Promise<void>;

    abstract stop(): Promise<void>;

    async importHealthCheck(url: string): Promise<void>
    {
        const module = await this.import(url, ExecutionScopes.APPLICATION);
        const healthCheck = module.default as HealthCheck;

        if (healthCheck?.isHealthy === undefined)
        {
            throw new InvalidHealthCheck(url);
        }

        this.addHealthCheck(healthCheck as HealthCheck);
    }

    addHealthCheck(healthCheck: HealthCheck): void
    {
        this.#healthChecks.set(healthCheck.name, healthCheck);
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
