
import RunnerService from '../RunnerService';
import Worker from '../worker/Worker';

interface Gateway extends RunnerService
{
    addWorker(worker: Worker): Promise<void>;

    removeWorker(worker: Worker): Promise<void>;
}

export default Gateway;
