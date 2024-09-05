
import type Segment from './Segment';
import type Class from './Class';
import type Procedure from './Procedure';

export default class Application
{
    #segments: Map<string, Segment> = new Map();

    addSegment(segment: Segment): void
    {
        this.#segments.set(segment.id, segment);
    }

    getClassNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            const classes = segment.getClasses();

            classes.forEach(clazz => names.add(clazz.fqn));
        }

        return [...names.values()];
    }

    hasClass(fqn: string): boolean
    {
        const classNames = this.getClassNames();

        return classNames.includes(fqn);
    }

    getClass(fqn: string): Class | undefined
    {
        for (const segment of this.#segments.values())
        {
            if (segment.hasClass(fqn))
            {
                return segment.getClass(fqn);
            }
        }

        return undefined;
    }

    getClassByImplementation(implementation: Function): Class | undefined
    {
        for (const segment of this.#segments.values())
        {
            const clazz = segment.getClassByImplementation(implementation);

            if (clazz !== undefined)
            {
                return clazz;
            }
        }

        return undefined
    }

    getProcedureNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            // We only expose the public and protected procedures
            // to protect access to private procedures

            const procedures = segment.getExposedProcedures();

            procedures.forEach(procedure => names.add(procedure.fqn));
        }

        return [...names.values()];
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    getProcedure(fqn: string): Procedure | undefined
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