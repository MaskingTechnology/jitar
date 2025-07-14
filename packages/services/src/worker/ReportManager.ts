
import LocalWorker from './LocalWorker';

const DEFAULT_INTERVAL = 5000;

export default class ReportManager
{
    readonly #worker: LocalWorker;
    readonly #interval: number;

    #timeout: ReturnType<typeof setInterval> | null = null;

    constructor(worker: LocalWorker, interval = DEFAULT_INTERVAL)
    {
        this.#worker = worker;
        this.#interval = interval;
    }

    start(): void
    {
        this.#timeout = setInterval(async () => this.#report(), this.#interval);
    }

    stop(): void
    {
        if (this.#timeout === null)
        {
            return;
        }

        clearInterval(this.#timeout);
    }

    #report(): Promise<void>
    {
        return this.#worker.reportAtGateway();
    }
}
