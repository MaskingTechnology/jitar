
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

    get statements() { return this.#statements; }

    get exports() { return this.#statements.filter(statement => statement instanceof ESExport); }

    get imports() { return this.#statements.filter(statement => statement instanceof ESImport); }

    get expressions() { return this.#statements.filter(statement => statement instanceof ESExpression); }

    get declarations() { return this.#statements.filter(statement => statement instanceof ESDeclaration); }

    get variables() { return this.#statements.filter(statement => statement instanceof ESVariable); }

    get functions() { return this.#statements.filter(statement => statement instanceof ESFunction); }

    get classes() { return this.#statements.filter(statement => statement instanceof ESClass); }

    get exported(): ESDeclaration[]
    {
        const declarations: ESDeclaration[] = [];

        for (const entry of this.exports)
        {
            for (const member of entry.members)
            {
                const declaration = this.getDeclaration(member.identifier);

                if (declaration === undefined)
                {
                    continue;
                }

                declarations.push(declaration);
            }
        }

        return declarations;
    }

    get exportedVariables() { return this.exported.filter(declaration => declaration instanceof ESVariable); }

    get exportedFunctions() { return this.exported.filter(declaration => declaration instanceof ESFunction); }

    get exportedClasses() { return this.exported.filter(declaration => declaration instanceof ESClass); }
    
    getExport(name: string): ESExport | undefined
    {
        return this.exports.find(entry => entry.hasMember(name));
    }

    getImport(name: string): ESImport | undefined
    {
        return this.imports.find(entry => entry.hasMember(name));
    }

    hasDeclaration(identifier: string): boolean
    {
        return this.declarations.some(entry => entry.is(identifier));
    }

    getDeclaration(identifier: string): ESDeclaration | undefined
    {
        return this.declarations.find(entry => entry.is(identifier));
    }

    hasVariable(identifier: string): boolean
    {
        return this.variables.some(entry => entry.is(identifier));
    }

    getVariable(identifier: string): ESVariable | undefined
    {
        return this.variables.find(entry => entry.is(identifier));
    }

    hasFunction(identifier: string): boolean
    {
        return this.functions.some(entry => entry.is(identifier));
    }

    getFunction(identifier: string): ESFunction | undefined
    {
        return this.functions.find(entry => entry.is(identifier));
    }

    hasClass(identifier: string): boolean
    {
        return this.classes.some(entry => entry.is(identifier));
    }

    getClass(identifier: string): ESClass | undefined
    {
        return this.classes.find(entry => entry.is(identifier));
    }

    toString(): string
    {
        return this.#statements
            .map(statement => statement.toString(true))
            .join('\n');
    }
}
