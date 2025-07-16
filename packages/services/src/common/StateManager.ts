
import States from './definitions/States';
import type { State } from './definitions/States';

type Task = () => Promise<void>;

export default class StateManager
{
    #state: State = States.STOPPED;

    get state() { return this.#state; }

    set state(state: State) { this.#state = state; }

    async start(task: Task): Promise<void>
    {
        if (this.isStarted())
        {
            return;
        }

        try
        {
            this.setStarting();

            await task();
        }
        catch (error: unknown)
        {
            this.setStopped();

            throw error;
        }
    }

    async stop(task: Task): Promise<void>
    {
        if (this.isStopped())
        {
            return;
        }

        this.setStopping();

        await task();

        this.setStopped();
    }

    isStarted(): boolean
    {
        return this.#notHasState(States.STOPPED);
    }

    isStopped(): boolean
    {
        return this.#hasState(States.STOPPED);
    }

    isAvailable(): boolean
    {
        return this.#hasState(States.AVAILABLE);
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
