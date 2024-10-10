
import type Imports from '../types/Imports';

import Class from './Class';
import Implementation from './Implementation';
import type Member from './Member';

export default class Module
{
    readonly #filename: string;
    readonly #location: string;
    readonly #imports: Imports;
    readonly #members: Member[] = [];

    constructor(filename: string, location: string, imports: Imports)
    {
        this.#filename = filename;
        this.#location = location;
        this.#imports = imports;
    }

    get filename() { return this.#filename; }

    get location() { return this.#location; }

    get imports() { return this.#imports; }

    get members() { return this.#members; }
    
    hasClasses(): boolean
    {
        return this.#members.some(member => member instanceof Class);
    }

    getClasses(): Class[]
    {
        return this.#members.filter(member => member instanceof Class);
    }

    hasImplementations(): boolean
    {
        return this.#members.some(member => member instanceof Implementation);
    }

    getImplementations(): Implementation[]
    {
        return this.#members.filter(member => member instanceof Implementation);
    }

    addMember(members: Member): void
    {
        this.#members.push(members);
    }
}
