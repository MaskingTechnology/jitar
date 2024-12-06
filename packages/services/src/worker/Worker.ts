
import RunnerService from '../RunnerService';

interface Worker extends RunnerService
{
   get id(): string | undefined;

   set id(id: string);
}

export default Worker;
