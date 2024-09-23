
import Procedure from '../../src/segment/models/Procedure';

const SEGMENT_PROCEDURES  =
{
    // First segment
    A: new Procedure('domain/first/a', []),
    B: new Procedure('domain/first/b', []),
    C: new Procedure('domain/first/c', []),

    // Second segment
    E: new Procedure('domain/second/e', []),
    F: new Procedure('domain/second/f', []),
    G: new Procedure('domain/second/g', [])
};

export { SEGMENT_PROCEDURES };
