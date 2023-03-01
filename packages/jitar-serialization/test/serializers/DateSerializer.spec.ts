
import { describe, expect, it } from 'vitest';

import DateSerializer from '../../src/serializers/DateSerializer';

import {
    fixedDate,
    serializedFixedDate, serializedInvalidDateValue, serializedInvalidDateString
} from '../_fixtures/serializers/DateSerializer.fixture';
