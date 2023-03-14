
import { describe, expect, it } from 'vitest';

import { APPLICATION } from '../../_fixtures/building/models/Application.fixture';

const application = APPLICATION;

describe('building/models/Application', () =>
{
    describe('.getSegmentModule(filename)', () =>
    {
        it('should get an existing segment module', () =>
        {
            const result = application.getSegmentModule('./order/createOrder.js');

            expect(result).toBeDefined();
        });

        it('should not get an non-existing segment module', () =>
        {
            const result = application.getSegmentModule('./non-existing.js');

            expect(result).toBeUndefined();
        });
    });
});
