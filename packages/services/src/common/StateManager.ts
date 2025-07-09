
import States from './definitions/States';
import type { State } from './definitions/States';

const DEFAULT_UNAVAILABLE_THRESHOLD = 6000;
const DEFAULT_DISCONNECTED_THRESHOLD = 12000;

export default class StateManager
{
    #state: State = States.HEALTHY;

    #unavailableThreshold: number;
    #disconnectedThreshold: number;

    #lastSet: number = Date.now();
    #lastUpdate: number = Date.now();

    constructor(unavailableThreshold = DEFAULT_UNAVAILABLE_THRESHOLD, disconnectedThreshold = DEFAULT_DISCONNECTED_THRESHOLD)
    {
        this.#unavailableThreshold = unavailableThreshold;
        this.#disconnectedThreshold = disconnectedThreshold;
    }

    get state() { return this.#state; }

    setState(state: State): void
    {
        this.#lastSet = Date.now();

        this.#state = state;
    }

    update(): State
    {
        this.#lastUpdate = Date.now();

        const interval = this.#lastUpdate - this.#lastSet;

        if (interval >= this.#unavailableThreshold)
        {
            this.#state = interval >= this.#disconnectedThreshold
                ? States.DISCONNECTED
                : States.UNAVAILABLE;
        }

        return this.#state;
    }
}
