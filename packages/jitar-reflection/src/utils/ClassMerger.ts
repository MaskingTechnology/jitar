
import ReflectionClass from '../models/ReflectionClass.js';
import ReflectionDeclaration from '../models/ReflectionDeclaration.js';
import ReflectionFunction from '../models/ReflectionFunction.js';
import ReflectionScope from '../models/ReflectionScope.js';

export default class ClassMerger
{
    merge(model: ReflectionClass, parent: ReflectionClass): ReflectionClass
    {
        const declarations = this.#mergeDeclarations(model.declarations, parent.declarations);
        const functions = this.#mergeFunctions(model.functions, parent.functions);
        const getters = this.#mergeFunctions(model.getters, parent.getters);
        const setters = this.#mergeFunctions(model.setters, parent.setters);
        
        const members = [...declarations.values(), ...functions.values(), ...getters.values(), ...setters.values()];

        return new ReflectionClass(model.name, parent.name, new ReflectionScope(members));
    }

    #mergeDeclarations(model: ReflectionDeclaration[], parent: ReflectionDeclaration[]): ReflectionDeclaration[]
    {
        const declarations = new Map<string, ReflectionDeclaration>();

        parent.forEach(declaration => declarations.set(declaration.name, declaration));
        model.forEach(declaration => declarations.set(declaration.name, declaration));

        return [...declarations.values()];
    }

    #mergeFunctions(model: ReflectionFunction[], parent: ReflectionFunction[]): ReflectionFunction[]
    {
        const functions = new Map<string, ReflectionFunction>();

        parent.forEach(funktion => functions.set(funktion.name, funktion));
        model.forEach(funktion => functions.set(funktion.name, funktion));

        return [...functions.values()];
    }
}