
import Loadable from '../types/Loadable.js';

export default interface ClassLoader
{
    loadClass(loadable: Loadable): Promise<Function>;
} /* eslint semi: 0 */ //conflicts with TypeScript linter
