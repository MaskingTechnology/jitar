
import type Worker from '../worker/Worker';

import type WorkerManager from './WorkerManager';

const DEFAULT_FREQUENCY = 5000;

export default class WorkerMonitor
{
    #workerManager: WorkerManager;
    #frequency: number;
    #interval: ReturnType<typeof setInterval> | null = null;

    constructor(workerManager: WorkerManager, frequency = DEFAULT_FREQUENCY)
    {
        this.#workerManager = workerManager;
        this.#frequency = frequency;
    }

    start(): void
    {
        this.#interval = setInterval(async () => this.#monitor(), this.#frequency);
    }

    stop(): void
    {
        if (this.#interval === null)
        {
            return;
        }

        clearInterval(this.#interval);
    }

    async #monitor(): Promise<void>
    {
        const workers = this.#workerManager.workers;
        const promises = workers.map(worker => this.#monitorWorker(worker));

        await Promise.all(promises);
    }

    async #monitorWorker(worker: Worker): Promise<void>
    {
        const available = await this.#checkWorkerAvailable(worker);

        if (available === false)
        {
            this.#workerManager.removeWorker(worker);
        }
    }

    async #checkWorkerAvailable(worker: Worker): Promise<boolean>
    {
        try
        {
            return await worker.isHealthy();
        }
        catch (error: unknown)
        {
            return false;
        }
    }
}
