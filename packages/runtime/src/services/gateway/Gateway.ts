
import RunnerService from '../RunnerService';
import Worker from '../worker/Worker';

export default interface Gateway extends RunnerService
{
    addWorker(worker: Worker): Promise<void>;
}
