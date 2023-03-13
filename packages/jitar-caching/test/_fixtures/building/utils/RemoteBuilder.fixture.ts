
import SegmentImplementation from '../../../../src/building/models/SegmentImplementation';
import SegmentProcedure from '../../../../src/building/models/SegmentProcedure';
import SegmentModule from '../../../../src/building/models/SegmentModule';

import { Reflector, ReflectionFunction } from 'jitar-reflection';

const code = `
export default function defaultFunction() { return 'default' }
export function anotherFunction(a, b) { return a + b; }
function privateFunction() { return 'private'; }
`;

const reflector = new Reflector();
const reflectionModule = reflector.parse(code);

const defaultFunction = reflectionModule.getFunction('defaultFunction') as ReflectionFunction;
const anotherFunction = reflectionModule.getFunction('anotherFunction') as ReflectionFunction;
const privateFunction = reflectionModule.getFunction('privateFunction') as ReflectionFunction;

const defaultImplementation = new SegmentImplementation('$1', 'default', 'public', '0.0.0', defaultFunction);
const anotherImplementation = new SegmentImplementation('', 'anotherFunction', 'public', '1.0.0', anotherFunction);
const privateImplementation = new SegmentImplementation('', 'privateFunction', 'private', '1.0.0', privateFunction);

const procedures: SegmentProcedure[] = [];
procedures.push(new SegmentProcedure('defaultFunction', [defaultImplementation]));
procedures.push(new SegmentProcedure('anotherFunction', [anotherImplementation]));
procedures.push(new SegmentProcedure('privateFunction', [privateImplementation]));

const segmentModule = new SegmentModule('app/module.js', procedures);

const codeResult =
`import { runProcedure } from "/jitar/hooks.js";

export default async function defaultFunction() {
\treturn runProcedure('defaultFunction', '0.0.0', {  }, this)
}

export async function anotherFunction(a, b) {
\treturn runProcedure('anotherFunction', '1.0.0', { 'a': a, 'b': b }, this)
}
`;

export
{
    segmentModule,
    codeResult
}
