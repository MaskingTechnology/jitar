
import type Worker from '../worker/Worker';
import States from '../common/definitions/States';

import type WorkerManager from './WorkerManager';

const DEFAULT_INTERVAL = 5000;

export default class WorkerMonitor
{
    readonly #workerManager: WorkerManager;
    readonly #interval: number;

    #timeout: ReturnType<typeof setInterval> | null = null;

    constructor(workerManager: WorkerManager, interval = DEFAULT_INTERVAL)
    {
        this.#workerManager = workerManager;
        this.#interval = interval;
    }

    get workerManager() { return this.#workerManager; }

    start(): void
    {
        this.#timeout = setInterval(async () => this.#monitor(), this.#interval);
    }

    stop(): void
    {
        if (this.#timeout === null)
        {
            return;
        }

        clearInterval(this.#timeout);
    }

    #monitor(): void
    {
        this.#workerManager.workers.forEach(worker => this.#checkWorker(worker));
    }

    async #checkWorker(worker: Worker): Promise<void>
    {
        const state = await worker.updateState();
        
        if (state === States.STOPPED)
        {
            this.#workerManager.removeWorker(worker.id as string);
        }
    }
}
