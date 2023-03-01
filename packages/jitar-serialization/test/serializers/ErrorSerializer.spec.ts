
import { describe, expect, it } from 'vitest';

import ErrorSerializer from '../../src/serializers/ErrorSerializer';

import {
    MockClassLoader,
    errorClass,
    serializedError
} from '../_fixtures/serializers/ErrorSerializer.fixture';
