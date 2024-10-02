
import RunnerService from '../RunnerService';

interface Worker extends RunnerService
{
   get trustKey(): string | undefined;
}

export default Worker;
