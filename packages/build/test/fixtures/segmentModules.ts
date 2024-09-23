
import Module from '../../src/segment/models/Module';

const SEGMENT_MODULES  =
{
    // First segment
    A: new Module('domain/first/a.js', 'domain/first', { 'default': { 'access': 'public' } }),
    B: new Module('domain/first/b.js', 'domain/first', { 'default': { 'access': 'private' } }),
    C: new Module('domain/first/c.js', 'domain/first', { 'default': { 'access': 'protected' } }),

    // Second segment
    E: new Module('domain/second/e.js', 'domain/second', { 'default': { 'access': 'public' } }),
    F: new Module('domain/second/f.js', 'domain/second', { 'default': { 'access': 'private' } }),
    G: new Module('domain/second/g.js', 'domain/second', { 'default': { 'access': 'private' } })
};

export { SEGMENT_MODULES };
