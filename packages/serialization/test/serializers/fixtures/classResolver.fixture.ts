
import ClassResolver from '../../../src/interfaces/ClassResolver';

import { CLASSES } from './classes.fixture';

class MockClassResolver implements ClassResolver
{
    resolveKey(clazz: Function): string | undefined
    {
        return clazz.name;
    }

    resolveClass(key: string): Function | undefined
    {
        switch (key)
        {
            case 'Data': return CLASSES.Data;
            case 'Constructed': return CLASSES.Constructed;
            case 'Nested': return CLASSES.Nested;
            case 'PrivateFieldClass': return CLASSES.PrivateFieldClass;
        }

        return undefined;
    }
}

export const classResolver = new MockClassResolver();
