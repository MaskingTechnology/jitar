
import { Reflector } from 'jitar-reflection';

const code = `

const hello = 'Hello World';

const sayHello = (name) => \`Hello \${name}\`;

export default class Test
{
    //empty
}

export { hello, sayHello };
`;

const reflector = new Reflector();

const theModule = reflector.parse(code);

export { theModule };
