
import type { ModuleImporter } from '@jitar/sourcing';

import States from './definitions/States';
import type { State } from './definitions/States';
import InvalidHealthCheck from './errors/InvalidHealthCheck';
import type HealthCheck from './interfaces/HealthCheck';

type HealthCheckResult =
{
    name: string;
    isHealthy: boolean;
}

export default class HealthManager
{
    #state: State = States.STOPPED;
    readonly #healthChecks = new Map<string, HealthCheck>();

    readonly #moduleImporter: ModuleImporter;
    readonly #healthCheckFiles: string[];

    constructor(moduleImporter: ModuleImporter, healthCheckFiles: string[] = [])
    {
        this.#moduleImporter = moduleImporter;
        this.#healthCheckFiles = healthCheckFiles;
    }

    get state() { return this.#state; }

    async start(): Promise<void>
    {
        if (this.#state !== States.STOPPED)
        {
            return;
        }

        try
        {
            this.#state = States.STARTING;

            await this.#loadHealthChecks();

            this.#state = States.STARTED;
        }
        catch (error: unknown)
        {
            this.#state = States.STOPPED;

            throw error;
        }
    }

    async stop(): Promise<void>
    {
        if (this.#state !== States.STARTED)
        {
            return;
        }

        try
        {
            this.#state = States.STOPPING;

            this.clearHealthChecks();

            this.#state = States.STOPPED;
        }
        catch (error: unknown)
        {
            this.#state = States.STARTED;

            throw error;
        }
    }

    async loadHealthCheck(filename: string): Promise<void>
    {
        const healthCheck = await this.#loadHealthCheck(filename);

        this.addHealthCheck(healthCheck);
    }

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

    async #loadHealthChecks(): Promise<void>
    {
        const healthChecks = await Promise.all(this.#healthCheckFiles.map(filename => this.#loadHealthCheck(filename)));

        healthChecks.forEach(healthCheck => this.addHealthCheck(healthCheck));
    }

    async #loadHealthCheck(filename: string): Promise<HealthCheck>
    {
        const module = await this.#moduleImporter.import(filename);

        return module.default as HealthCheck;
    }

    #handleHealthCheckResult(result: PromiseSettledResult<HealthCheckResult>, healthChecks: Map<string, boolean>): void
    {
        if (result.status !== 'fulfilled')
        {
            healthChecks.set(result.reason.name, false);

            return;
        }

        healthChecks.set(result.value.name, result.value.isHealthy);
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
