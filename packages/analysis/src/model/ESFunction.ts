
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import ESDeclaration from './ESDeclaration';

export default class ESFunction extends ESDeclaration
{
    readonly #parameters: ESParameter[];
    readonly #body: ESBlock;
    readonly #isAsync: boolean;

    constructor(identifier: string | undefined, parameters: ESParameter[], body: ESBlock, isAsync = false)
    {
        super(identifier);

        this.#parameters = parameters;
        this.#body = body;
        this.#isAsync = isAsync;
    }

    get parameters() { return this.#parameters; }

    get body() { return this.#body; }

    get isAsync() { return this.#isAsync; }

    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const identifier = this.identifier ?? '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}function ${identifier}(${parameters.join(', ')}) ${body}`;
    }
}
