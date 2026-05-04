
import ESExport from './ESExport';
import ESImport from './ESImport';
import ESExpression from './ESExpression';
import ESDeclaration from './ESDeclaration';
import ESClass from './ESClass';
import ESFunction from './ESFunction';
import ESVariable from './ESVariable';
import type ESStatement from './ESStatement';

export default class ESModule
{
    readonly #statements: ESStatement[];

    constructor(statements: ESStatement[])
    {
        this.#statements = statements;
    }

    get exports() { return this.#statements.filter(statement => statement instanceof ESExport); }

    get imports() { return this.#statements.filter(statement => statement instanceof ESImport); }

    get expressions() { return this.#statements.filter(statement => statement instanceof ESExpression); }

    get declarations() { return this.#statements.filter(statement => statement instanceof ESDeclaration); }

    get classes() { return this.#statements.filter(statement => statement instanceof ESClass); }
    
    get functions() { return this.#statements.filter(statement => statement instanceof ESFunction); }

    get variables() { return this.#statements.filter(statement => statement instanceof ESVariable); }

    toString(): string
    {
        return this.#statements
            .map(statement => statement.toString())
            .join(' ');
    }
}
