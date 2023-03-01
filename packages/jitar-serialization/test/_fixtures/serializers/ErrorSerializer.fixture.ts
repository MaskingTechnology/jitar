
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
errorClass.stack = 'stacktrace';

const serializedError = { serialized: true, name: 'Error', source: null, args: [], fields: { stack: 'stacktrace', message: 'hello' } };

export {
    MockClassLoader,
    errorClass,
    serializedError
}
