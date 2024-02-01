
import LocalGateway from './LocalGateway.js';
import Worker from './Worker.js';

const DEFAULT_FREQUENCY = 5000;

export default class WorkerMonitor
{
    #gateway: LocalGateway;
    #frequency: number;
    #interval: ReturnType<typeof setInterval> | null = null;

    constructor(gateway: LocalGateway, frequency: number = DEFAULT_FREQUENCY)
    {
        this.#gateway = gateway;
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
        const workers = this.#gateway.workers;
        const promises = workers.map(async (worker: Worker) => this.#monitorWorker(worker));

        await Promise.all(promises);
    }

    async #monitorWorker(worker: Worker): Promise<void>
    {
        const available = await this.#checkWorkerAvailable(worker);

        if (available === false)
        {
            this.#gateway.removeWorker(worker);
        }
    }

    async #checkWorkerAvailable(worker: Worker): Promise<boolean>
    {
        try
        {
            return await worker.isHealthy();
        }
        catch (error)
        {
            return false;
        }
    }
}
