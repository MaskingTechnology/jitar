
import StatusCodes from './definitions/StatusCodes';

import ImplementationNotFound from './errors/ImplementationNotFound';
import InvalidSegment from './errors/InvalidSegment';
import ProcedureNotFound from './errors/ProcedureNotFound';

import type Runner from './interfaces/Runner';

import type Request from './models/Request';
import Response from './models/Response';
import Application from './models/Application';
import Segment from './models/Segment';
import type Class from './models/Class';
import type Procedure from './models/Procedure';
import type Implementation from './models/Implementation';
import type Version from './models/Version';

import ArgumentConstructor from './utils/ArgumentConstructor';
import ErrorConverter from './utils/ErrorConverter';

export default class ExecutionManager implements Runner
{
    #argumentConstructor: ArgumentConstructor = new ArgumentConstructor();
    #errorConverter: ErrorConverter = new ErrorConverter();
    #application: Application = new Application();

    async addSegment(segment: Segment): Promise<void>
    {
        if ((segment instanceof Segment) === false)
        {
            throw new InvalidSegment();
        }

        this.#application.addSegment(segment);
    }

    getClassNames(): string[]
    {
        return this.#application.getClassNames();
    }

    hasClass(fqn: string): boolean
    {
        return this.#application.hasClass(fqn);
    }

    getClass(fqn: string): Class | undefined
    {
        return this.#application.getClass(fqn);
    }

    getClassByImplementation(implementation: Function): Class | undefined
    {
        return this.#application.getClassByImplementation(implementation);
    }

    getProcedureNames(): string[]
    {
        return this.#application.getProcedureNames();
    }

    hasProcedure(fqn: string): boolean
    {
        return this.#application.hasProcedure(fqn);
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        return this.#application.getProcedure(fqn);
    }

    async run(request: Request): Promise<Response>
    {
        const implementation = this.#getImplementation(request.fqn, request.version);

        const args: unknown[] = this.#argumentConstructor.extract(implementation.parameters, request.args);

        try
        {
            const result = await implementation.executable.call(request, ...args);

            return new Response(StatusCodes.OK, result);
        }
        catch (error: unknown)
        {
            const status = this.#errorConverter.toStatus(error);

            return new Response(status, error);
        }
    }

    #getImplementation(fqn: string, version: Version): Implementation
    {
        const procedure = this.#application.getProcedure(fqn);

        if (procedure === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        const implementation = procedure.getImplementation(version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, version.toString());
        }

        return implementation;
    }
}
