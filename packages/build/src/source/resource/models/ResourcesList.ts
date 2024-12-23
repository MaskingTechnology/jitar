
export default class ResourcesList
{
    readonly #resources: string[];

    constructor(resources: string[])
    {
        this.#resources = resources;
    }

    isResourceModule(moduleFilename: string): boolean
    {
        return this.#resources.includes(moduleFilename);
    }
}
