
import type { Request, Response } from '@jitar/execution';

import type Worker from '../worker/Worker';

import NoWorkerAvailable from './errors/NoWorkerAvailable';

export default class WorkerBalancer
{
    #workers: Worker[] = [];
    #currentIndex = 0;

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
        if (this.#workers.length === 0)
        {
            return;
        }

        if (this.#currentIndex >= this.#workers.length)
        {
            this.#currentIndex = 0;
        }

        return this.#workers[this.#currentIndex++];
    }

    run(request: Request): Promise<Response>
    {
        const worker = this.getNextWorker();

        if (worker === undefined)
        {
            throw new NoWorkerAvailable(request.fqn);
        }

        return worker.run(request);
    }
}
