
import { ESClass, ESDeclaration, ESFunction, ESScope } from '../models';

export default class ClassMerger
{
    merge(model: ESClass, parent: ESClass): ESClass
    {
        const declarations = this.#mergeDeclarations(model.declarations, parent.declarations);
        const functions = this.#mergeFunctions(model.functions, parent.functions);
        const getters = this.#mergeFunctions(model.getters, parent.getters);
        const setters = this.#mergeFunctions(model.setters, parent.setters);
        
        const members = [...declarations.values(), ...functions.values(), ...getters.values(), ...setters.values()];

        return new ESClass(model.name, parent.name, new ESScope(members));
    }

    #mergeDeclarations(model: ESDeclaration[], parent: ESDeclaration[]): ESDeclaration[]
    {
        const declarations = new Map<string, ESDeclaration>();

        parent.forEach(declaration => declarations.set(declaration.name, declaration));
        model.forEach(declaration => declarations.set(declaration.name, declaration));

        return [...declarations.values()];
    }

    #mergeFunctions(model: ESFunction[], parent: ESFunction[]): ESFunction[]
    {
        const functions = new Map<string, ESFunction>();

        parent.forEach(funktion => functions.set(funktion.name, funktion));
        model.forEach(funktion => functions.set(funktion.name, funktion));

        return [...functions.values()];
    }
}
