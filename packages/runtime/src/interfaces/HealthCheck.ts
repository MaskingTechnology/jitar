
export default interface HealthCheck
{
    isHealthy(): Promise<boolean>;
} /* eslint semi: 0 */ //conflicts with TypeScript linter
