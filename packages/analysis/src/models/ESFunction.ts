
import ESMember from './ESMember.js';
import ESParameter from './ESParameter.js';

export default class ESFunction extends ESMember
{
    readonly #parameters: ESParameter[];
    readonly #body: string;
    readonly #isAsync: boolean;

    constructor(name: string, parameters: ESParameter[], body: string, isStatic = false, isAsync = false, isPrivate = false)
    {
        super(name, isStatic, isPrivate);

        this.#parameters = parameters;
        this.#body = body;
        this.#isAsync = isAsync;
    }

    get parameters() { return this.#parameters; }

    get body() { return this.#body; }

    get isAsync() { return this.#isAsync; }

    toString(): string
    {
        const parameters = this.parameters.map((parameter) => parameter.toString());

        return `${this.isAsync ? 'async ' : ''}${this.name}(${parameters.join(', ')}) { ${this.body} }`;
    }
}
