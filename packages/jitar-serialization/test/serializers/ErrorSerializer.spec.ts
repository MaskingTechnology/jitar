
import { describe, expect, it } from 'vitest';

import ErrorSerializer from '../../src/serializers/ErrorSerializer';

import {
    MockClassLoader,
    errorClass, otherClass
} from '../_fixtures/serializers/ErrorSerializer.fixture';

const classLoader = new MockClassLoader();
const serializer = new ErrorSerializer(classLoader);

describe('serializers/ErrorSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an error', () =>
        {
            const supportsErrorClass = serializer.canSerialize(errorClass);

            expect(supportsErrorClass).toBeTruthy();
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsOtherClass = serializer.canSerialize(otherClass);

            expect(supportsOtherClass).toBeFalsy();
        });
    });
});
