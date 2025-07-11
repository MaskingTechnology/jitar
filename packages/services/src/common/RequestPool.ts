
import { Request, Response, Runner } from '@jitar/execution';

const DEFAULT_POOL_SIZE = 20;

type QueueItem =
{
    request: Request,
    resolve: (value: Response | PromiseLike<Response>) => void,
    reject: (reason?: unknown) => void
};

export default class RequestPool implements Runner
{
    readonly #runner: Runner;
    readonly #size: number;

    readonly #queue: QueueItem[] = [];

    #started = false;
    #activeCount = 0;

    constructor(runner: Runner, size = DEFAULT_POOL_SIZE)
    {
        this.#runner = runner;
        this.#size = size;
    }
    
    start(): void
    {
        this.#started = true;

        this.#update();
    }

    stop(): void
    {
        this.#started = false;
    }

    run(request: Request): Promise<Response>
    {
        return new Promise<Response>((resolve, reject) =>
        {
            this.#queue.push({ request, resolve, reject });

            this.#update();
        });
    }
    
    #update(): void
    {
        if (this.#noUpdateRequired())
        {
            return;
        }

        const queueSize = this.#queue.length;
        const idleCount = this.#size - this.#activeCount;
        const activationCount = Math.min(queueSize, idleCount);

        this.#activate(activationCount);
    }

    #noUpdateRequired(): boolean
    {
        return this.#isStopped()
            || this.#queueEmpty()
            || this.#allActive();
    }

    #isStopped(): boolean
    {
        return this.#started === false;
    }

    #queueEmpty(): boolean
    {
        return this.#queue.length === 0;
    }

    #allActive(): boolean
    {
        return this.#activeCount >= this.#size;
    }

    #activate(count: number): void
    {
        const items = this.#queue.splice(0, count);

        this.#activeCount += count;

        items.forEach(item => this.#perform(item));
    }

    async #perform(item: QueueItem): Promise<void>
    {
        try
        {
            const response = await this.#runner.run(item.request);

            item.resolve(response);
        }
        catch (error: unknown)
        {
            item.reject(error);
        }
        finally
        {
            this.#activeCount--;

            this.#update();
        }
    }
}
