
import { createNodeFilename } from '../definitions/Files.js';
import ImplementationNotFound from '../errors/ImplementationNotFound.js';
import MissingParameterValue from '../errors/MissingParameterValue.js';
import ProcedureNotFound from '../errors/ProcedureNotFound.js';
import RepositoryNotAvailable from '../errors/RepositoryNotAvailable.js';
import UnknownParameter from '../errors/UnknownParameter.js';

import Context from '../models/Context.js';
import Implementation from '../models/Implementation.js';
import Procedure from '../models/Procedure.js';
import Segment from '../models/Segment.js';
import Version from '../models/Version.js';

import Module from '../types/Module.js';

import ModuleLoader from '../utils/ModuleLoader.js';
import UrlRewriter from '../utils/UrlRewriter.js';

import Gateway from './Gateway.js';
import LocalGateway from './LocalGateway.js';
import Node from './Node.js';
import Repository from './Repository.js';

export default class LocalNode extends Node
{
    #segments: Map<string, Segment> = new Map();
    #gateway?: Gateway;
    #repository?: Repository;
    #clientId = '';

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

    getSegment(id: string): Segment | undefined
    {
        return this.#segments.get(id);
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

        await repository.setRuntime(this);

        const moduleLocation = await repository.getModuleLocation(this.#clientId);

        ModuleLoader.setBaseUrl(moduleLocation);

        this.#repository = repository;
    }

    async import(url: string, base?: string): Promise<Module>
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

    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const procedure = this.#getProcedure(fqn);
        
        if (procedure === undefined)
        {
            return this.#runGateway(fqn, version, args, headers);
        }

        return this.#runProcedure(procedure, version, args, headers);
    }

    async #runGateway(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        if (this.#gateway === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        return this.#gateway.run(fqn, version, args, headers);
    }

    async #runProcedure(procedure: Procedure, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const implementation = procedure.getImplementation(version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, version.toString());
        }

        const context = this.#createContext(headers);
        const values = this.#extractParameterValues(implementation, args);

        return await implementation.executable.call(context, ...values);
    }

    #createContext(headers: Map<string, string>)
    {
        return new Context(headers);
    }

    #extractParameterValues(implementation: Implementation, parameters: Map<string, unknown>): unknown[]
    {
        const values: unknown[] = [];

        // const incomingKeys = Array.from(parameters.keys());
        // const knownKeys = implementation.parameters.map(parameter => parameter.name);
        // const additionalKeys = incomingKeys.filter(key => knownKeys.includes(key) === false);
        
        // if(additionalKeys.length !== 0)
        // {
        //     throw new UnknownParameter(additionalKeys[0]);
        // }

        // for (const parameter of implementation.parameters)
        // {
        //     const value = parameters.get(parameter.name);

        //     if (value === undefined && parameter.isOptional === false)
        //     {
        //         throw new MissingParameterValue(parameter.name);
        //     }

        //     values.push(value);
        // }

        return values;
    }
}
