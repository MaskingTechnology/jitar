
import MissingParameterValue from '../../src/core/errors/MissingParameterValue';
import UnknownParameter from '../../src/core/errors/UnknownParameter';

import
{
    privateImplementation,
    publicImplementation,
    parameterImplementation
} from '../_fixtures/core/Implementation.fixture';

describe('core/Implementation', () =>
{
    describe('.version', () =>
    {
        it('should have a version', () =>
        {
            expect(privateImplementation.version.toString()).toBe('0.0.0');
        });
    });

    describe('.public', () =>
    {
        it('should be private', () =>
        {
            expect(privateImplementation.public).toBe(false);
        });

        it('should be public', () =>
        {
            expect(publicImplementation.public).toBe(true);
        });
    });

    describe('.parameters', () =>
    {
        it('should have no parameters', () =>
        {
            const parameters = publicImplementation.parameters;

            expect(parameters.length).toBe(0);
        });

        it('should have parameters', () =>
        {
            const parameters = parameterImplementation.parameters;

            expect(parameters.length).toBe(2);

            expect(parameters[0].name).toBe('mandatory');
            expect(parameters[0].isOptional).toBe(false);

            expect(parameters[1].name).toBe('optional');
            expect(parameters[1].isOptional).toBe(true);
        });
    });

    describe('.run(name, version, args)', () =>
    {
        it('should run a procedure without parameters', async () =>
        {
            const result = await publicImplementation.run(new Map(), new Map());

            expect(result).toBe('public');
        });

        it('should run a procedure with parameter values', async () =>
        {
            const args = new Map().set('mandatory', 'mandatory').set('optional', 'optional');
            const result = await parameterImplementation.run(args, new Map());

            expect(result).toBe('mandatory optional');
        });

        it('should run a procedure without an optional parameter value', async () =>
        {
            const args = new Map().set('mandatory', 'mandatory');
            const result = await parameterImplementation.run(args, new Map());

            expect(result).toBe('mandatory default');
        });

        it('should not run a procedure without a mandatory parameter value', async () =>
        {
            const run = async () => await parameterImplementation.run(new Map(), new Map());

            expect(run).rejects.toEqual(new MissingParameterValue('mandatory'));
        });

        it('should not run a procedure with an additional parameter', async () => 
        {
            const args = new Map().set('mandatory', 'mandatory').set('optional','optional').set('additional','additional');
            const run = async () => await parameterImplementation.run(args, new Map())

            expect(run).rejects.toEqual(new UnknownParameter('additional'));
        })
    });
});
