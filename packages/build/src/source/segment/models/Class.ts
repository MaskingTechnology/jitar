
import { ESClass } from '@jitar/analysis';

import Member from './Member';

export default class Class extends Member
{
    readonly #model: ESClass;

    constructor(id: string, importKey: string, fqn: string, model: ESClass)
    {
        super(id, importKey, fqn);

        this.#model = model;
    }

    get model() { return this.#model; }
}
