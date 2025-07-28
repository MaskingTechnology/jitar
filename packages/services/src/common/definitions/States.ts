
const States =
{
    STARTING: 'starting',
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
} as const;

type Keys = keyof typeof States;
type State = typeof States[Keys];

export default States;
export { State };
