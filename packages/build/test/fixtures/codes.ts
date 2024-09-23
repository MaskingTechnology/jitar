
const A =
`
import b from './b';

export default async function a() {
    await b();
}
`;

const B =
`
export default async function b() { }
`;

const C =
`
import D from '../shared/d';
import e from '../second/e';

export default async function c() {
    await e();
}
`;

const D =
`
export default class D {}
`;

const E =
`
import D from '../shared/d';
import f from './f';

export default async function e() {
    await f();
}
`;

const F =
`
import g, { h } from './g';

export default async function f() {
    await g();
}
`;

const G =
`
export default async function g() { }

export async function h() { }

export class i {}
`;

const CODES = {  A, B, C, D, E, F, G };

export { CODES };
