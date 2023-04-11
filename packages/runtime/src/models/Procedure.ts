
import Implementation from './Implementation.js';
import Version from './Version.js';

export default class Procedure
{
    #fqn: string;
    #implementations: Map<Version, Implementation> = new Map();
    #latestImplementation?: Implementation;

    constructor(fqn: string)
    {
        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }

    get public()
    {
        // If at least one implementation is public, the procedure is public
        // Public procedures can be called from outside the segment

        const implementations = [...this.#implementations.values()];

        return implementations.some(implementation => implementation.public);
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
