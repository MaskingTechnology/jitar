
import type { State } from './common/definitions/States';

interface Service
{
    get url(): string;

    get state(): State;

    start(): Promise<void>;

    stop(): Promise<void>;

    isHealthy(): Promise<boolean>;

    getHealth(): Promise<Map<string, boolean>>

    updateState(): Promise<State>;
}

export default Service;
