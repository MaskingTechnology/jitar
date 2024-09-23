
import { Reflector } from '@jitar/reflection';

import Module from '../../src/module/models/Module';

import { CODES } from './codes';

const reflector = new Reflector();

const MODULES =
{
    A: new Module('domain/first/a.js', CODES.A, reflector.parse(CODES.A)),
    B: new Module('domain/first/b.js', CODES.B, reflector.parse(CODES.B)),
    C: new Module('domain/first/c.js', CODES.C, reflector.parse(CODES.C)),
    D: new Module('domain/shared/d.js', CODES.D, reflector.parse(CODES.D)),
    E: new Module('domain/second/e.js', CODES.E, reflector.parse(CODES.E)),
    F: new Module('domain/second/f.js', CODES.F, reflector.parse(CODES.F)),
    G: new Module('domain/second/g.js', CODES.G, reflector.parse(CODES.G))
};

export { MODULES };
