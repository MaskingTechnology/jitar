
interface HealthCheck
{
    get timeout(): number | undefined;

    isHealthy(): Promise<boolean>;
}

export default HealthCheck;
