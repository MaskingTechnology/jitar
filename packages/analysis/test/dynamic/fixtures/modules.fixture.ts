
import { CLASSES } from "./classes.fixture";
import { OBJECTS } from "./objects.fixture";
import { FUNCTIONS } from "./functions.fixture";

const mixedModule =
{
    Person: CLASSES.Child,
    johnDoe: OBJECTS.CLASS,
    requiredFunction: FUNCTIONS.REQUIRED_ARGS
};

export const MODULES =
{
    MIXED: mixedModule
};
