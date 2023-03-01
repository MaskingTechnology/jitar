
import { describe, expect, it } from 'vitest';

import SerializedArrayBuffer from '../../../jitar/src/runtime/serialization/types/SerializedArrayBuffer';

import {
    viewUint16, viewInt8, viewBigInt64,
    serializedViewUint16, serializedViewInt8, serializedViewBigInt64, serializedViewInt7, serializedViewString8
} from '../_fixtures/serializers/ArrayBufferSerializer.fixture';
