
import { Request, Response as ResultResponse } from '@jitar/execution';
import { File } from '@jitar/sourcing';

interface Remote
{
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    provide(filename: string): Promise<File>;

    isHealthy(): Promise<boolean>;

    getHealth(): Promise<Map<string, boolean>>;

    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<void>

    run(request: Request): Promise<ResultResponse>;
}

export default Remote;
