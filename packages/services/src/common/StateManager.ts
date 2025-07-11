
import States from './definitions/States';
import type { State } from './definitions/States';

export default class StateManager
{
    #state: State = States.STOPPED;

    get state() { return this.#state; }

    set state(state: State) { this.#state = state; }

    isNotStopped(): boolean
    {
        return this.#notHasState(States.STOPPED);
    }

    isNotStarted(): boolean
    {
        return this.#hasState(States.STOPPING, States.STOPPED);
    }

    setStarting(): void
    {
        this.#state = States.STARTING;
    }

    setAvailable(): void
    {
        this.#state = States.AVAILABLE;
    }

    setUnavailable(): void
    {
        this.#state = States.UNAVAILABLE;
    }

    setAvailability(available: boolean): State
    {
        this.#state = available ? States.AVAILABLE : States.UNAVAILABLE;

        return this.#state;
    }

    setStopping(): void
    {
        this.#state = States.STOPPING;
    }

    setStopped(): void
    {
        this.#state = States.STOPPED;
    }

    #hasState(...states: State[]): boolean
    {
        return states.includes(this.#state);
    }

    #notHasState(...states: State[]): boolean
    {
        return this.#hasState(...states) === false;
    }
}
