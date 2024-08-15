
import type { ModuleRepository } from '../../module';
import type { Segmentation } from '../../segment';

export default class Application
{
    #repository: ModuleRepository;
    #segmentation: Segmentation;

    constructor(repository: ModuleRepository, segmentation: Segmentation)
    {
        this.#repository = repository;
        this.#segmentation = segmentation;
    }

    get repository() { return this.#repository; }

    get segmentation() { return this.#segmentation; }
}
