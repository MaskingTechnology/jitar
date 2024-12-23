
import type { ResourcesList } from '../../resource';
import type { ModuleRepository } from '../../module';
import type { Segmentation } from '../../segment';

export default class Application
{
    readonly #repository: ModuleRepository;
    readonly #resources: ResourcesList;
    readonly #segmentation: Segmentation;

    constructor(repository: ModuleRepository, resources: ResourcesList, segmentation: Segmentation)
    {
        this.#repository = repository;
        this.#resources = resources;
        this.#segmentation = segmentation;
    }

    get resources() { return this.#resources; }

    get repository() { return this.#repository; }

    get segmentation() { return this.#segmentation; }
}
