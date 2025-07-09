
import type { Request, Response } from '@jitar/execution';

import States from '../common/definitions/States';
import type Worker from '../worker/Worker';

import NoWorkerAvailable from './errors/NoWorkerAvailable';

export default class WorkerBalancer
{
    readonly #workers: Worker[] = [];
    #currentIndex = 0;

    get workers() { return this.#workers; }

    addWorker(worker: Worker): void
    {
        if (this.#workers.includes(worker))
        {
            return;
        }

        this.#workers.push(worker);
    }

    removeWorker(worker: Worker): void
    {
        const index = this.#workers.indexOf(worker);

        if (index === -1)
        {
            return;
        }

        this.#workers.splice(index, 1);
    }

    getNextWorker(): Worker | undefined
    {
        const workers = this.#workers.filter(worker => worker.state === States.HEALTHY);

        if (workers.length === 0)
        {
            return;
        }

        if (this.#currentIndex >= workers.length)
        {
            this.#currentIndex = 0;
        }

        return workers[this.#currentIndex++];
    }

    async run(request: Request): Promise<Response>
    {
        const worker = this.getNextWorker();

        if (worker === undefined)
        {
            throw new NoWorkerAvailable(request.fqn);
        }

        return worker.run(request);
    }
}
