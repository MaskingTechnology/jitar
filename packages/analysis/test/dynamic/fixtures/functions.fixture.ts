
import { CLASSES } from "./classes.fixture";

const Child = CLASSES.Child;

function requiredFunction(a: string, b: typeof Child, c: number): string
{
    return a + b + c;
}

function optionalFunction(a: string, b = new Child(1, 'Jane', 'Doe', 42), c = 0): string
{
    return a + b + c;
}

export const FUNCTIONS =
{
    REQUIRED_ARGS: requiredFunction,
    OPTIONAL_ARGS: optionalFunction
};
