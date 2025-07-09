
import { Request, Response as ResultResponse } from '@jitar/execution';
import { File } from '@jitar/sourcing';

import type { State } from '../common/definitions/States';

interface Remote
{
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    provide(filename: string): Promise<File>;

    isHealthy(): Promise<boolean>;

    getHealth(): Promise<Map<string, boolean>>;

    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<string>;

    reportWorker(id: string, state: State): Promise<void>;

    removeWorker(id: string): Promise<void>;

    run(request: Request): Promise<ResultResponse>;
}

export default Remote;
