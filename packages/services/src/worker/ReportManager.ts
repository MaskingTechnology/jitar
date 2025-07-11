
import LocalWorker from './LocalWorker';

const DEFAULT_FREQUENCY = 5000;

export default class ReportManager
{
    readonly #worker: LocalWorker;
    readonly #frequency: number;

    #interval: ReturnType<typeof setInterval> | null = null;

    constructor(worker: LocalWorker, frequency = DEFAULT_FREQUENCY)
    {
        this.#worker = worker;
        this.#frequency = frequency;
    }

    start(): void
    {
        this.#interval = setInterval(async () => this.#report(), this.#frequency);
    }

    stop(): void
    {
        if (this.#interval === null)
        {
            return;
        }

        clearInterval(this.#interval);
    }

    #report(): Promise<void>
    {
        return this.#worker.reportAtGateway();
    }
}
