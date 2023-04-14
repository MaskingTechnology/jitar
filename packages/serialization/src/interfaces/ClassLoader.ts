
import Loadable from '../types/Loadable.js';

interface ClassLoader
{
    loadClass(loadable: Loadable): Promise<Function>;
}

export default ClassLoader;
