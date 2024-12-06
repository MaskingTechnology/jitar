
import RunnerService from '../RunnerService';
import type Worker from '../worker/Worker';

interface Gateway extends RunnerService
{
    addWorker(worker: Worker): Promise<string>;

    removeWorker(worker: Worker): Promise<void>;
}

export default Gateway;
