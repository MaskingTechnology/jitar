
import ReflectionClass from './ReflectionClass.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionModule
{
    #members: ReflectionMember[];
    #exports: ReflectionExport[];

    constructor(member: ReflectionMember[], exports: ReflectionExport[] = [])
    {
        this.#members = member;
        this.#exports = exports;
    }

    get members(): ReflectionMember[] { return this.#members; }

    get classes(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionClass); }

    get functions(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionFunction); }

    get fields(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionField); }

    getMember(name: string): ReflectionMember | undefined
    {
        return this.#members.find(member => member.name === name);
    }
}
