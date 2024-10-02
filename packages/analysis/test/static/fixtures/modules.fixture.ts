
export const MODULES =
{
    TERMINATED:
`
import { member } from 'module';
import { member as alias } from 'module2';

const name = 'Peter' + ' van ' + 'Vliet';

export default function sum(a, b) { return a + b; }

[1, 2, 3, 4, 5].sort((a, b) => a - b);

try { sum(1, 2); } catch (error) { console.error(error); }

export class Person
{
    #name;
    #age;

    constructor(name, age)
    {
        this.#name = name;
        this.#age = age;
    }
}

const peter = new Person(name, 42);

async function async() { }
const a = async;
const b = async () => {};

const as = 12;
export { as as hi };

export { name, peter };
`,
    UNTERMINATED:
`
    import { member } from 'module'
    import { member as alias } from 'module2'
    
    const name = 'Peter' + ' van ' + 'Vliet'
    
    export default function sum(a, b) { return a + b }
    
    [1, 2, 3, 4, 5].sort((a, b) => a - b)
    
    try { sum(1, 2) } catch (error) { console.error(error) }
    
    export class Person
    {
        #name
        #age
    
        constructor(name, age)
        {
            this.#name = name
            this.#age = age
        }
    }
    
    const peter = new Person(name, 42)
    
    export { name, peter }
`
};
