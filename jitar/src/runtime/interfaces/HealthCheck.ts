
export default interface HealthCheck
{
    isHealthy(): Promise<boolean>;
}
