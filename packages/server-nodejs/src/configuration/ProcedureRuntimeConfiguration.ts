
export default class ProcedureRuntimeConfiguration
{
    #middlewares?: string[];

    constructor(middlewares?: string[])
    {
        this.#middlewares = middlewares;
    }

    get middlewares() { return this.#middlewares; }
}
