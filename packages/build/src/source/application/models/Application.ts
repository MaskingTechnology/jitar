
import type { ResourceList } from '../../resource';
import type { ModuleRepository } from '../../module';
import type { Segmentation } from '../../segment';

export default class Application
{
    readonly #resources: ResourceList;
    readonly #repository: ModuleRepository;
    readonly #segmentation: Segmentation;

    constructor(resources: ResourceList, repository: ModuleRepository, segmentation: Segmentation)
    {
        this.#resources = resources;
        this.#repository = repository;
        this.#segmentation = segmentation;
    }

    get resources() { return this.#resources; }

    get repository() { return this.#repository; }

    get segmentation() { return this.#segmentation; }
}
