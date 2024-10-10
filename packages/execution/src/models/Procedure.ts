
import type Implementation from './Implementation';
import Version from './Version';

export default class Procedure
{
    readonly #fqn: string;
    readonly #implementations = new Map<Version, Implementation>();
    #latestImplementation?: Implementation;

    constructor(fqn: string)
    {
        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }

    get public(): boolean
    {
        const implementations = [...this.#implementations.values()];

        return implementations.some(implementation => implementation.public);
    }

    get protected(): boolean
    {
        const implementations = [...this.#implementations.values()];

        return implementations.some(implementation => implementation.protected);
    }

    addImplementation(implementation: Implementation): Procedure
    {
        this.#implementations.set(implementation.version, implementation);

        if (this.#isNewLatestImplementation(implementation))
        {
            this.#latestImplementation = implementation;
        }

        return this;
    }

    #isNewLatestImplementation(implementation: Implementation): boolean
    {
        return this.#latestImplementation === undefined
            || implementation.version.greater(this.#latestImplementation.version);
    }

    getImplementation(version: Version): Implementation | undefined
    {
        const selectedVersion = this.#selectAvailableVersion(version);

        return this.#implementations.get(selectedVersion);
    }

    #selectAvailableVersion(version: Version): Version
    {
        let selectedVersion = Version.DEFAULT;

        for (const implementationVersion of this.#implementations.keys())
        {
            if (implementationVersion.equals(version))
            {
                return implementationVersion;
            }

            if (implementationVersion.greater(version))
            {
                continue;
            }

            if (selectedVersion.less(implementationVersion))
            {
                selectedVersion = implementationVersion;
            }
        }

        return selectedVersion;
    }
}
