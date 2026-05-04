
import { ESClass, ESClassMember } from '../model';

export default class ClassMerger
{
    merge(model: ESClass, parent: ESClass): ESClass
    {
        const constructors = model.construct !== undefined ? [model.construct] : [];
        const fields = this.#mergeMembers(model.fields, parent.fields);
        const methods = this.#mergeMembers(model.methods, parent.methods);
        const getters = this.#mergeMembers(model.getters, parent.getters);
        const setters = this.#mergeMembers(model.setters, parent.setters);
        
        const members = [...fields, ...constructors, ...methods, ...getters, ...setters];

        return new ESClass(model.identifier, parent.identifier, members);
    }

    #mergeMembers<T extends ESClassMember>(model: T[], parent: T[]): T[]
    {
        const members = new Map<string, T>();

        parent.forEach(member => members.set(member.identifier!, member));
        model.forEach(member => members.set(member.identifier!, member));

        return [...members.values()];
    }
}
