
interface Service
{
    get url(): string;

    start(): Promise<void>;

    stop(): Promise<void>;

    isHealthy(): Promise<boolean>;

    getHealth(): Promise<Map<string, boolean>>
}

export default Service;
