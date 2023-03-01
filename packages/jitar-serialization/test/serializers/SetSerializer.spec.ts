
import { describe, expect, it } from 'vitest';

import SetSerializer from '../../src/serializers/SetSerializer';

import {
    emptySet, mixedSet, nestedSet,
    serializedEmptySet, serializedMixedSet, serializedNestedSet
} from '../_fixtures/serializers/SetSerializer.fixture';
