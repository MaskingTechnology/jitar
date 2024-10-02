
export const CLASSES =
{
    DECLARATION: "class Name {}",
    EXTENDS: "class Name extends Parent {}",
    EXPRESSION: "const name = class {}",
    MEMBERS: `class Name
{
    #field1 = 'value1';
    field2;

    static #field3 = "value3";
    static field4;

    constructor(field1, ...field2)
    {
        this.#field1 = field1;
        this.field2 = field2;
    }
    
    get #getter1() { return field1; }

    get getter2() { return field2; }

    static get #getter3() { return field3; }

    static get getter4() { return field4; }

    set #setter1(value) { this.#field1 = value; }

    set setter2(value) { this.#field2 = value; }

    static set #setter3(value) { this.#field3 = value; }

    static set setter4(value) { this.#field4 = value; }

    method1() { return this.#field1; }

    async method2() { return this.#field1; }

    static method3() { return this.#field1; }

    static async method4() { return this.#field1; }

    #method5() { return this.#field1; }

    *generator1() { yield 1; }

    async *generator2() { yield 1; }

    static async *generator3() { yield 1; }
}`
};
