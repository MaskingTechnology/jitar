
import Runtime from '../Runtime.js';

type JitarHooks =
    {
        setRuntime: (runtime: Runtime) => void;
        setDependencyLoader: (loader: Function) => void;
    }

export default JitarHooks;
