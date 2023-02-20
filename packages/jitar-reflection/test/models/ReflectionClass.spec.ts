
import { reflectionClass } from '../_fixtures/models/ReflectionClass.fixture';

describe('models/ReflectionClass', () =>
{
    // Scope tests are omitted
    
    describe('.canRead(name)', () =>
    {
        it('should read a public field', () =>
        {
            const canRead = reflectionClass.canRead('length');

            expect(canRead).toBe(true);
        });

        it('should read a private field with getter', () =>
        {
            const canRead = reflectionClass.canRead('name');

            expect(canRead).toBe(true);
        });

        it('should not read a private field without a getter', () =>
        {
            const canRead = reflectionClass.canRead('secret');

            expect(canRead).toBe(false);
        });
    });

    describe('.canWrite(name)', () =>
    {
        it('should write a public field', () =>
        {
            const canWrite = reflectionClass.canWrite('length');

            expect(canWrite).toBe(true);
        });

        it('should write a private field with setter', () =>
        {
            const canWrite = reflectionClass.canWrite('age');

            expect(canWrite).toBe(true);
        });

        it('should not wite a private field without a setter', () =>
        {
            const canWrite = reflectionClass.canWrite('secret');

            expect(canWrite).toBe(false);
        });
    });

    describe('.canCall(name)', () =>
    {
        it('should call a public function', () =>
        {
            const canCall = reflectionClass.canCall('toString');

            expect(canCall).toBe(true);
        });

        it('should not call a private function', () =>
        {
            const canCall = reflectionClass.canCall('secretStuff');

            expect(canCall).toBe(false);
        });
    });
});
