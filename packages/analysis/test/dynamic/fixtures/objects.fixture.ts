
import { CLASSES } from "./classes.fixture";

export const OBJECTS =
{
    PLAIN: { id: 2, fullName: 'Jane Doe', age: 42 },
    CLASS: new CLASSES.Child(1, 'John', 'Doe', 42),
    ERROR: new Error('Plain error'),
    CUSTOM_ERROR: new CLASSES.CustomError('Custom error', 'with extras')
};
