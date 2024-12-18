
export default class ResourceList
{
    readonly #resources: string[];

    constructor(resources: string[])
    {
        this.#resources = resources;
    }

    isModuleResource(moduleFilename: string): boolean
    {
        return this.#resources.includes(moduleFilename);
    }
}
