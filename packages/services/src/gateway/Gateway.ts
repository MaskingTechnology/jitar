
import RunnerService from '../RunnerService';
import type { State } from '../common/definitions/States';
import type Worker from '../worker/Worker';

interface Gateway extends RunnerService
{
    addWorker(worker: Worker): Promise<string>;

    reportWorker(id: string, state: State): Promise<void>;

    removeWorker(id: string): Promise<void>;
}

export default Gateway;
