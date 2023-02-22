
import Implementation from '../../../../src/runtime/caching/models/Implementation';
import SegmentModule from '../../../../src/runtime/caching/models/SegmentModule';

import { Reflector, ReflectionFunction, ReflectionField, ReflectionModule } from 'jitar-reflection';

const code = `
export function defaultFunction() {
return 'default'
}

export function anotherFunction(a, b) {
return a + b;
}

function privateFunction() {
return 'private';
}
`;

const reflector = new Reflector();
const reflectionModule = reflector.parse(code);

const defaultFunction = reflectionModule.getFunction('defaultFunction') as ReflectionFunction;
const anotherFunction = reflectionModule.getFunction('anotherFunction') as ReflectionFunction;
const privateFunction = reflectionModule.getFunction('privateFunction') as ReflectionFunction;

const implementations: Map<string, Implementation> = new Map();
implementations.set('default', new Implementation('', 'defaultFunction', 'public', '0.0.0', defaultFunction));
implementations.set('anotherFunction', new Implementation('', 'anotherFunction', 'public', '1.0.0', anotherFunction));
implementations.set('privateFunction', new Implementation('', 'privateFunction', 'private', '1.0.0', privateFunction));

const segmentModule = new SegmentModule('app/module.js', reflectionModule, implementations);

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
