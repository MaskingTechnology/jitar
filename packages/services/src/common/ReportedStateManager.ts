
import States from './definitions/States';
import type { State } from './definitions/States';

import StateManager from './StateManager';

const DEFAULT_UNAVAILABLE_THRESHOLD = 6000;
const DEFAULT_STOPPED_THRESHOLD = 18000;

export default class ReportedStateManager extends StateManager
{
    readonly #unavailableThreshold: number;
    readonly #stoppedThreshold: number;

    #lastReport: number = Date.now();
    #lastUpdate: number = Date.now();

    constructor(unavailableThreshold = DEFAULT_UNAVAILABLE_THRESHOLD, stoppedThreshold = DEFAULT_STOPPED_THRESHOLD)
    {
        super();

        this.#unavailableThreshold = unavailableThreshold;
        this.#stoppedThreshold = stoppedThreshold;
    }

    report(state: State): void
    {
        this.#lastReport = Date.now();

        this.state = state;
    }

    update(): State
    {
        this.#lastUpdate = Date.now();

        const interval = this.#lastUpdate - this.#lastReport;

        if (interval >= this.#unavailableThreshold)
        {
            this.state = interval >= this.#stoppedThreshold
                ? States.STOPPED
                : States.UNAVAILABLE;
        }

        return this.state;
    }
}
