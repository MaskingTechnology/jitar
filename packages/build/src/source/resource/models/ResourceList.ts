
export default class ResourceList
{
    readonly #resources: string[];

    constructor(resources: string[])
    {
        this.#resources = resources;
    }

    get resources() { return this.#resources; }

    isModuleResource(moduleFilename: string): boolean
    {
        return this.#resources.includes(moduleFilename);
    }
}
