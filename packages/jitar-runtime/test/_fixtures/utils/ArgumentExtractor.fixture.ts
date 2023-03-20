
import ArrayParameter from '../../../src/models/ArrayParameter';
import NamedParameter from '../../../src/models/NamedParameter';
import ObjectParameter from '../../../src/models/ObjectParameter';

const PARAMETERS =
{
    NAMED: [new NamedParameter('id', false), new NamedParameter('name', false), new NamedParameter('age', true)],
    ARRAY: [new ArrayParameter('$0', [new NamedParameter("query", false), new NamedParameter("sort", true)])],
    OBJECT: [new ObjectParameter('$0', [new NamedParameter("query", false), new NamedParameter("sort", true)])]
}

const ARGUMENTS =
{
    NAMED_ALL: new Map<string, unknown>([['id', 1], ['name', 'John Doe'], ['age', 42]]),
    NAMED_OPTIONAL: new Map<string, unknown>([['id', 1], ['name', 'John Doe']]),
    NAMED_MISSING: new Map<string, unknown>([['id', 1], ['age', 42]]),
    NAMED_EXTRA: new Map<string, unknown>([['id', 1], ['name', 'John Doe'], ['age', 42], ['extra', 'extra']]),

    ARRAY_ALL: new Map<string, unknown>([['$0', new Map<string, unknown>([['query', 'foo'], ['sort', 'bar']])]]),
    ARRAY_OPTIONAL: new Map<string, unknown>([['$0', new Map<string, unknown>([['query', 'foo']])]]),
    ARRAY_MISSING: new Map<string, unknown>([['$0', new Map<string, unknown>([['sort', 'bar']])]]),
    ARRAY_EXTRA: new Map<string, unknown>([['$0', new Map<string, unknown>([['query', 'foo'], ['sort', 'bar'], ['extra', 'extra']])]]),
}

export { PARAMETERS, ARGUMENTS }
