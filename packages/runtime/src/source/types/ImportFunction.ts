
import Module from './Module';

type ImportFunction = (specifier: string) => Promise<Module>;

export default ImportFunction;
