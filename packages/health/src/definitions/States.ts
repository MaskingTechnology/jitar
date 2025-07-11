
const States =
{
    STARTING: 'starting',
    STARTED: 'started',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
} as const;

type Keys = keyof typeof States;
type State = typeof States[Keys];

export default States;
export type { State };
