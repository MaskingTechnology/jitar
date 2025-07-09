
const States =
{
    STARTING: 'starting',
    HEALTHY: 'healthy',
    UNHEALTHY: 'unhealthy',
    UNAVAILABLE: 'unavailable',
    STOPPING: 'stopping',
    DISCONNECTED: 'disconnected'
} as const;

type Keys = keyof typeof States;
type State = typeof States[Keys];

export default States;
export { State };
