
import type Worker from '../worker/Worker';
import States from '../common/definitions/States';

import type WorkerManager from './WorkerManager';

const DEFAULT_FREQUENCY = 5000;

export default class WorkerMonitor
{
    readonly #workerManager: WorkerManager;
    readonly #frequency: number;

    #interval: ReturnType<typeof setInterval> | null = null;

    constructor(workerManager: WorkerManager, frequency = DEFAULT_FREQUENCY)
    {
        this.#workerManager = workerManager;
        this.#frequency = frequency;
    }

    get workerManager() { return this.#workerManager; }

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

    #monitor(): void
    {
        this.#workerManager.workers.forEach(worker => this.#checkWorker(worker));
    }

    async #checkWorker(worker: Worker): Promise<void>
    {
        const state = await worker.updateState();
        
        if (state === States.DISCONNECTED)
        {
            this.#workerManager.removeWorker(worker.id as string);
        }
    }
}
