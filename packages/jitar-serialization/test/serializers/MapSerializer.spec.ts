
import { describe, expect, it } from 'vitest';

import MapSerializer from '../../src/serializers/MapSerializer';

import {
    emptyMap, mixedMap, nestedMap,
    serializedEmptyMap, serializedMixedMap, serializedNestedMap
} from '../_fixtures/serializers/MapSerializer.fixture';
