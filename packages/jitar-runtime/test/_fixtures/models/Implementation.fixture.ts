
import { AccessLevel } from '../../../src/definitions/AccessLevel';
import Implementation from '../../../src/models/Implementation';
import NamedParameter from '../../../src/models/NamedParameter';
import Version from '../../../src/models/Version';

function getPrivate(): string
{
    return 'private';
}

function getPublic(): string
{
    return 'public';
}

function getParameters(mandatory: string, optional = 'default')
{
    return `${mandatory} ${optional}`;
}

function getContext(): unknown
{
    // A function does not have a 'this' by default.
    // TypeScript is (luckily) very strict about it.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this;
}

const parameters =
[
    new NamedParameter('mandatory', false),
    new NamedParameter('optional', true)
];

const privateImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], getPrivate);
const publicImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], getPublic);
const parameterImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, parameters, getParameters);
const contextImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], getContext);

export
{
    privateImplementation,
    publicImplementation,
    parameterImplementation,
    contextImplementation
}
