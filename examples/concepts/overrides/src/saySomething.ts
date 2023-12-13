
import sayHello from './sayHello';

export default async function saySomething(name = 'World'): Promise<string>
{
    return sayHello(name);
}
