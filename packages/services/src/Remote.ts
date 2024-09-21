
import { Request, Response as ResultResponse } from '@jitar/execution';
import { File } from '@jitar/sourcing';

export default interface Remote
{
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    loadFile(filename: string): Promise<File>;

    isHealthy(): Promise<boolean>;

    getHealth(): Promise<Map<string, boolean>>;

    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<void>

    run(request: Request): Promise<ResultResponse>;
}
