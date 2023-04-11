
import ReflectionDestructuredArray from './ReflectionDestructuredArray.js';
import ReflectionField from './ReflectionField.js';
import ReflectionDestructuredObject from './ReflectionDestructuredObject.js';

type ReflectionParameter = ReflectionField | ReflectionDestructuredObject | ReflectionDestructuredArray;

export default ReflectionParameter;
