
import RunnerService from '../RunnerService';
import type { State } from '../common/definitions/States';

interface Worker extends RunnerService
{
   get id(): string | undefined;

   set id(id: string);

   set state(state: State);
}

export default Worker;
