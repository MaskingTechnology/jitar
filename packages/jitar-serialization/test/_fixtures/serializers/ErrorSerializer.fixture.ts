
import ClassLoader from '../../../src/interfaces/ClassLoader';
import Loadable from '../../../src/types/Loadable';

class MockClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        throw new Error(`Unknown class: ${loadable.source}`);
    }
}

const errorClass = new Error('hello');
const otherClass = new Map();

export {
    MockClassLoader,
    errorClass, otherClass
}
