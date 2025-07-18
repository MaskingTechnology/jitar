
import { Logger } from '@jitar/logging';

import Task from './types/Task';

import ScheduledTask from './ScheduledTask';

export default class ScheduleManager
{
    readonly #scheduledTasks: ScheduledTask[] = [];

    readonly #logger: Logger;

    constructor(logger: Logger)
    {
        this.#logger = logger;
    }

    create(task: Task, interval?: number): ScheduledTask
    {
        const scheduledTask = new ScheduledTask(this.#logger, task, interval);

        this.#scheduledTasks.push(scheduledTask);

        return scheduledTask;
    }

    remove(scheduledTask: ScheduledTask): void
    {
        const index = this.#scheduledTasks.indexOf(scheduledTask);

        if (index < 0)
        {
            return;
        }

        this.#scheduledTasks.splice(index, 1);
    }

    startAll(): void
    {
        this.#scheduledTasks.forEach(scheduledTask => scheduledTask.start());        
    }

    stopAll(): void
    {
        this.#scheduledTasks.forEach(scheduledTask => scheduledTask.stop());        
    }
}
