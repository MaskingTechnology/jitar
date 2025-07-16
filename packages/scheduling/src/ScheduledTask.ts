
import { Logger } from '@jitar/logging';

import Task from './types/Task';

const DEFAULT_INTERVAL = 5000;

export default class ScheduledTask
{
    readonly #logger: Logger;
    readonly #task: Task;
    readonly #interval: number;

    #timeout: ReturnType<typeof setTimeout> | null = null;

    constructor(logger: Logger, task: Task, interval = DEFAULT_INTERVAL)
    {
        this.#logger = logger;
        this.#task = task;
        this.#interval = interval;
    }

    start(): void
    {
        this.#scheduleNextExecution();
    }

    stop(): void
    {
        if (this.#timeout === null)
        {
            return;
        }

        clearTimeout(this.#timeout);

        this.#timeout = null;
    }

    #scheduleNextExecution(): void
    {
        this.#timeout = setTimeout(async () =>
        {
            if (this.#timeout === null)
            {
                return;
            }

            await this.#executeTask();

            this.#scheduleNextExecution();

        }, this.#interval);
    }

    async #executeTask(): Promise<void>
    {
        try
        {
            await this.#task();
        }
        catch (error: unknown)
        {
            this.#logger.warn('Scheduled task failed', error);
        }
    }
}
