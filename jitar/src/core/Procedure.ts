
import ImplementationNotFound from './errors/ImplementationNotFound.js';
import Implementation from './Implementation.js';
import FqnBuilder from './utils/FqnBuilder.js';
import Version from './Version.js';

export default class Procedure
{
    #module: string;
    #name: string;
    #fqn: string;
    #implementations: Map<Version, Implementation> = new Map();
    #latestImplementation?: Implementation;

    constructor(module: string, name: string)
    {
        this.#module = module;
        this.#name = name;

        this.#fqn = FqnBuilder.build(module, name);
    }

    get module() { return this.#module; }

    get name() { return this.#name; }

    get fqn() { return this.#fqn; }

    get public()
    {
        // If at least one implementation is public, the procedure is public
        // Public procedures can be called from outside the segment

        const implementations = [...this.#implementations.values()];

        return implementations.some(implementation => implementation.public);
    }

    addImplementation(implementation: Implementation): void
    {
        this.#implementations.set(implementation.version, implementation);

        if (this.#isNewLatestImplementation(implementation))
        {
            this.#latestImplementation = implementation;
        }
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

    async run(version: Version, args: Map<string, unknown>): Promise<unknown>
    {
        const implementation = this.getImplementation(version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(this.fqn, version.toString());
        }

        return implementation.run(args);
    }
}
