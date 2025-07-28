
import RemoteBuilder from '../common/RemoteBuilder';
import RemoteWorker from './RemoteWorker';

export default class RemoteWorkerBuilder
{
    readonly #remoteBuilder: RemoteBuilder;
    readonly #unavailableThreshold?: number;
    readonly #stoppedThreshold?: number;

    constructor(remoteBuilder: RemoteBuilder, unavailableThreshold?: number, stoppedThreshold?: number)
    {
        this.#remoteBuilder = remoteBuilder;
        this.#unavailableThreshold = unavailableThreshold;
        this.#stoppedThreshold = stoppedThreshold;
    }

    build(url: string, procedures: string[], trustKey?: string): RemoteWorker
    {
        const remote = this.#remoteBuilder.build(url);
        const procedureNames = new Set<string>(procedures);
        const unavailableThreshold = this.#unavailableThreshold;
        const stoppedThreshold = this.#stoppedThreshold;

        return new RemoteWorker({ url, trustKey, remote, procedureNames, unavailableThreshold, stoppedThreshold });
    }
}
