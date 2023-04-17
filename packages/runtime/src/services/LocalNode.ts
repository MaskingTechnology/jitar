
import { createNodeFilename } from '../definitions/Files.js';
import ImplementationNotFound from '../errors/ImplementationNotFound.js';
import ProcedureNotFound from '../errors/ProcedureNotFound.js';
import RepositoryNotAvailable from '../errors/RepositoryNotAvailable.js';
import Context from '../models/Context.js';
import Procedure from '../models/Procedure.js';
import Segment from '../models/Segment.js';
import Version from '../models/Version.js';
import Module from '../types/Module.js';
import ArgumentConstructor from '../utils/ArgumentConstructor.js';
import ModuleLoader from '../utils/ModuleLoader.js';
import UrlRewriter from '../utils/UrlRewriter.js';

import Gateway from './Gateway.js';
import LocalGateway from './LocalGateway.js';
import Node from './Node.js';
import Repository from './Repository.js';

import { setRuntime, setDependencyLoader } from '../hooks.js';

export default class LocalNode extends Node
{
    #argumentConstructor: ArgumentConstructor;
    #segments: Map<string, Segment> = new Map();
    #gateway?: Gateway;
    #repository?: Repository;
    #clientId = '';

    constructor(url?: string, argumentConstructor = new ArgumentConstructor())
    {
        super(url);

        this.#argumentConstructor = argumentConstructor;
    }

    getProcedureNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            // We only expose the public procedures
            // to protect access to private procedures

            const procedures = segment.getPublicProcedures();

            procedures.forEach(procedure => names.add(procedure.fqn));
        }

        return [...names.values()];
    }

    async loadSegment(name: string): Promise<void>
    {
        const filename = createNodeFilename(name);
        const module = await this.import(filename);
        const segment = module.segment as Segment;

        this.addSegment(segment);
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

    async setGateway(gateway: Gateway): Promise<void>
    {
        if (gateway instanceof LocalGateway || this.url !== undefined)
        {
            await gateway.addNode(this);
        }

        this.#gateway = gateway;
    }

    async setRepository(repository: Repository, segmentNames: string[]): Promise<void>
    {
        this.#clientId = await repository.registerClient(segmentNames);

        setRuntime(this);
        setDependencyLoader((name: string) => ModuleLoader.import(name));

        const moduleLocation = await repository.getModuleLocation(this.#clientId);

        ModuleLoader.setBaseUrl(moduleLocation);

        this.#repository = repository;
    }

    import(url: string, base?: string): Promise<Module>
    {
        if (this.#repository === undefined)
        {
            throw new RepositoryNotAvailable();
        }

        if (base !== undefined)
        {
            url = UrlRewriter.addBase(url, base);
        }

        return this.#repository.importModule(this.#clientId, url);
    }

    run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const procedure = this.#getProcedure(fqn);
        
        return procedure === undefined
            ? this.#runGateway(fqn, version, args, headers)
            : this.#runProcedure(procedure, version, args, headers);
    }

    #runGateway(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        if (this.#gateway === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        return this.#gateway.run(fqn, version, args, headers);
    }

    #runProcedure(procedure: Procedure, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const implementation = procedure.getImplementation(version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, version.toString());
        }

        const context = new Context(headers);
        const values: unknown[] = this.#argumentConstructor.extract(implementation.parameters, args);

        return implementation.executable.call(context, ...values);
    }
}
