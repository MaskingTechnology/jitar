
import RunnerService from '../RunnerService';

import type { State } from '../common/definitions/States';

interface Worker extends RunnerService
{
   get id(): string | undefined;

   set id(id: string);

   get state(): State;

   set state(state: State);

   updateState(): Promise<State>;
}

export default Worker;
