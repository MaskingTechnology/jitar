
interface HealthCheck
{
    get name(): string;
    
    get timeout(): number | undefined;

    isHealthy(): Promise<boolean>;
}

export default HealthCheck;
