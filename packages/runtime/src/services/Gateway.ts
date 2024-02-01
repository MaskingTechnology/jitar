
import Worker from './Worker.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default abstract class Gateway extends ProcedureRuntime
{
    abstract addWorker(worker: Worker): Promise<void>;
}
