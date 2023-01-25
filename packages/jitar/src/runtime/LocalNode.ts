
import ProcedureNotFound from '../core/errors/ProcedureNotFound.js';
import Segment from '../core/Segment.js';
import SegmentBuilder from '../core/SegmentBuilder.js';
import Version from '../core/Version.js';
import Module from '../core/types/Module.js';
import SegmentModule from '../core/types/SegmentModule.js';

import RepositoryNotAvailable from './errors/RepositoryNotAvaiable.js';
import Gateway from './Gateway.js';
import LocalGateway from './LocalGateway.js';
import Node from './Node.js';
import Repository from './Repository.js';
import ModuleLoader from './utils/ModuleLoader.js';
import UrlRewriter from './utils/UrlRewriter.js';

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
        const segmentFile = `${name}.segment.local.js`;
        const module = await this.import(segmentFile) as SegmentModule;
        const segment = SegmentBuilder.build(name, module);

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

    #getProcedureSegment(fqn: string): Segment | undefined
    {
        for (const segment of this.#segments.values())
        {
            if (segment.hasProcedure(fqn))
            {
                return segment;
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
        const segment = this.#getProcedureSegment(fqn);
        const runner = segment ?? this.#gateway;

        if (runner === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        return runner.run(fqn, version, args, headers);
    }
}
