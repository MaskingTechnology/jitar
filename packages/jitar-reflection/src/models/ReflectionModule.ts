
import ReflectionModel from './ReflectionModel.js';

import ReflectionClass from './ReflectionClass.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionImport from './ReflectionImport.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionModule extends ReflectionModel
{
    #imports: ReflectionImport[];
    #members: ReflectionMember[];
    #exports: ReflectionExport[];

    constructor(imports: ReflectionImport[], member: ReflectionMember[], exports: ReflectionExport[] = [])
    {
        super();
        
        this.#imports = imports;
        this.#members = member;
        this.#exports = exports;
    }

    get imports(): ReflectionImport[] { return this.#imports; }

    get members(): ReflectionMember[] { return this.#members; }

    get exports(): ReflectionExport[] { return this.#exports; }

    get classes(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionClass); }

    get functions(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionFunction); }

    get fields(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionField); }

    get exported(): ReflectionMember[]
    {
        const members = this.#exports.map(exported => this.getMember(exported.name));

        return members.filter(member => member !== undefined) as ReflectionMember[];
    }

    getMember(name: string): ReflectionMember | undefined
    {
        return this.#members.find(member => member.name === name);
    }
}
