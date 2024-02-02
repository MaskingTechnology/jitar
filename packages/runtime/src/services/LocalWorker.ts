
import { ExecutionScopes } from '../definitions/ExecutionScope.js';
import { createWorkerFilename } from '../definitions/Files.js';

import Unauthorized from '../errors/generic/Unauthorized.js';
import ImplementationNotFound from '../errors/ImplementationNotFound.js';
import ProcedureNotFound from '../errors/ProcedureNotFound.js';
import InvalidTrustKey from '../errors/InvalidTrustKey.js';

import Procedure from '../models/Procedure.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';
import Segment from '../models/Segment.js';
import ArgumentConstructor from '../utils/ArgumentConstructor.js';

import Gateway from './Gateway.js';
import Worker from './Worker.js';
import Repository from './Repository.js';

import { setRuntime } from '../hooks.js';

const JITAR_TRUST_HEADER_KEY = 'X-Jitar-Trust-Key';

export default class LocalWorker extends Worker
{
    #gateway?: Gateway;
    #trustKey?: string;
    #argumentConstructor: ArgumentConstructor;

    #segmentNames: Set<string> = new Set();
    #segments: Map<string, Segment> = new Map();

    constructor(repository: Repository, gateway?: Gateway, url?: string, trustKey?: string, argumentConstructor = new ArgumentConstructor())
    {
        super(repository, url);

        this.#gateway = gateway;
        this.#trustKey = trustKey;
        this.#argumentConstructor = argumentConstructor;

        setRuntime(this);
    }

    get trustKey() { return this.#trustKey; }

    set segmentNames(names: Set<string>)
    {
        this.#segmentNames = names;
    }

    async start(): Promise<void>
    {
        await super.start();

        await this.#loadSegments();

        if (this.#gateway !== undefined)
        {
            await this.#gateway.start();
        }
    }

    async stop(): Promise<void>
    {
        this.#unloadSegments();
        
        if (this.#gateway !== undefined)
        {
            await this.#gateway.stop();
        }

        await super.stop();
    }

    getProcedureNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            // We only expose the public procedures
            // to protect access to private procedures

            const procedures = segment.getExposedProcedures();

            procedures.forEach(procedure => names.add(procedure.fqn));
        }

        return [...names.values()];
    }

    addSegment(segment: Segment): void
    {
        this.#segments.set(segment.id, segment);
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    run(request: Request): Promise<Response>
    {
        const procedure = this.#getProcedure(request.fqn);

        return procedure === undefined
            ? this.#useGateway(request)
            : this.#runProcedure(procedure, request);
    }

    async #loadSegments()
    {
        for (const segmentName of this.#segmentNames)
        {
            await this.#loadSegment(segmentName);
        }
    }

    async #loadSegment(name: string): Promise<void>
    {
        const filename = createWorkerFilename(name);
        const module = await this.import(filename, ExecutionScopes.APPLICATION);
        const segment = module.segment as Segment;

        this.addSegment(segment);
    }

    #unloadSegments(): void
    {
        this.#segments.clear();
    }

    #useGateway(request: Request): Promise<Response>
    {
        if (this.#gateway === undefined)
        {
            throw new ProcedureNotFound(request.fqn);
        }
        
        if (this.#trustKey !== undefined)
        {
            const headers = request.headers;
            headers.set(JITAR_TRUST_HEADER_KEY, this.#trustKey);
        }

        return this.#gateway.run(request);
    }

    async #runProcedure(procedure: Procedure, request: Request): Promise<Response>
    {
        const trustKey = request.getHeader(JITAR_TRUST_HEADER_KEY);
        
        if (trustKey !== undefined && this.#trustKey !== trustKey)
        {
            throw new InvalidTrustKey();
        }
        
        if (trustKey === undefined && procedure.protected)
        {
            throw new Unauthorized();
        }

        const implementation = procedure.getImplementation(request.version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, request.version.toString());
        }

        const values: unknown[] = this.#argumentConstructor.extract(implementation.parameters, request.args);

        const result = await implementation.executable.call(request, ...values);

        return new Response(result);
    }

    #getProcedure(fqn: string): Procedure | undefined
    {
        for (const segment of this.#segments.values())
        {
            if (segment.hasProcedure(fqn))
            {
                return segment.getProcedure(fqn);
            }
        }

        return undefined;
    }
}
