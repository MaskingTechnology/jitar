
import { ReflectionModule } from '@jitar/reflection';

export default class Module
{
    #filename: string
    #code: string;
    #content: ReflectionModule;

    constructor(filename: string, code: string, content: ReflectionModule)
    {
        this.#code = code;
        this.#filename = filename;
        this.#content = content;
    }

    get filename() { return this.#filename; }
    
    get code() { return this.#code; }

    get content() { return this.#content; }
}
