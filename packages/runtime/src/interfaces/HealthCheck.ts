
interface HealthCheck
{
    isHealthy(): Promise<boolean>;
}

export default HealthCheck;
