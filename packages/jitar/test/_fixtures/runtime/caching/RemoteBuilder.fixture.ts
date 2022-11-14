
import FlexObject from '../../../../src/core/types/FlexObject';
import Implementation from '../../../../src/runtime/caching/models/Implementation';
import SegmentModule from '../../../../src/runtime/caching/models/SegmentModule';

function defaultFunction(): string
{
    return 'default';
}

function anotherFunction(a: string, b: string): string
{
    return a + b;
}

function privateFunction(): string
{
    return 'private';
}

const functions: FlexObject =
{
    default: defaultFunction,
    anotherFunction
}

const implementations: Map<string, Implementation> = new Map();
implementations.set('default', new Implementation('', 'defaultFunction', 'public', '0.0.0', defaultFunction));
implementations.set('anotherFunction', new Implementation('', 'anotherFunction', 'public', '1.0.0', anotherFunction));
implementations.set('privateFunction', new Implementation('', 'privateFunction', 'private', '1.0.0', privateFunction));

const segmentModule = new SegmentModule('app/module.js', functions, implementations);

const codeResult =
    `import { runProcedure } from "/jitar/hooks.js";

export default async function defaultFunction() {
\treturn runProcedure('defaultFunction', '0.0.0', {  })
}

export async function anotherFunction(a, b) {
\treturn runProcedure('anotherFunction', '1.0.0', { 'a': a, 'b': b })
}
`;

export
{
    segmentModule,
    codeResult
}
