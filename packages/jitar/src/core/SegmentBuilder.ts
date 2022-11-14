
import SegmentModule from './types/SegmentModule.js';
import SegmentProcedure from './types/SegmentProcedure.js';
import SegmentImplementation from './types/SegmentImplementation.js';

import ReflectionHelper from './reflection/ReflectionHelper.js';

import Implementation from './Implementation.js';
import Procedure from './Procedure.js';
import Segment from './Segment.js';
import Version from './Version.js';

export default class SegmentBuilder
{
    static build(id: string, module: SegmentModule): Segment
    {
        const segment = new Segment(id);

        for (const definition of module.procedures)
        {
            const procedure = this.#buildProcedure(definition);

            segment.addProcedure(procedure);
        }

        return segment;
    }

    static #buildProcedure(definition: SegmentProcedure): Procedure
    {
        const module = definition.module;
        const name = definition.name;

        const procedure = new Procedure(module, name);

        for (const implementationDefinition of definition.implementations)
        {
            const implementation = this.#buildImplementation(implementationDefinition);

            procedure.addImplementation(implementation);
        }

        return procedure;
    }

    static #buildImplementation(definition: SegmentImplementation): Implementation
    {
        const version = Version.parse(definition.version);
        const access = definition.access;
        const executable = definition.executable;
        const parameters = ReflectionHelper.getFunctionParameters(executable);

        return new Implementation(version, access, parameters, executable);
    }
}
