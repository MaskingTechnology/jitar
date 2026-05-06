
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import ESClassMember from './ESClassMember';

export default class ESConstructor extends ESClassMember
{
    readonly #parameters: ESParameter[];
    readonly #body: ESBlock;
    
    constructor(parameters: ESParameter[], body: ESBlock)
    {
        super('constructor', 'public', 'instance');

        this.#parameters = parameters;
        this.#body = body;
    }

    get parameters() { return this.#parameters; }

    get body() { return this.#body; }

    toString(): string
    {
        const parameters = this.#parameters.map((parameter) => parameter.toString());
        const body = this.#body.toString();

        return `${this.identifier}(${parameters.join(',')}) ${body}`;
    }
}
