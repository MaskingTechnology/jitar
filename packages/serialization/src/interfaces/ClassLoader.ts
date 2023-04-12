
import Loadable from '../types/Loadable.js';

export default interface ClassLoader
{
    loadClass(loadable: Loadable): Promise<Function>;
}
