
import { describe, expect, it } from 'vitest';

import ClassSerializer from '../../src/serializers/ClassSerializer';

import {
    Data, Constructed, Nested, PrivateFieldClass, MockClassLoader,
    dataClass, constructedClass, nestedClass, privateClass,
    serializedDataClass, serializedConstructedClass, serializedNestedClass, serializedPrivateClass, serializedInvalidClass, serializedUnserializableClass
} from '../_fixtures/serializers/ClassSerializer.fixture';
