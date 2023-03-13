
const Files =
{
    MODULE_PATTERN: '**/*.js',
    SEGMENT_PATTERN: '**/*.segment.json',
    NODE_SEGMENT_PATTERN: '**/*.node.segment.js',
    REPOSITORY_SEGMENT_PATTERN: '**/*.repository.segment.js'
};

Object.freeze(Files);

function convertToLocalFilename(filename: string): string
{
    return filename.replace('.js', '.local.js');
}

function convertToRemoteFilename(filename: string): string
{
    return filename.replace('.js', '.remote.js');
}

function createNodeFilename(name: string): string
{
    return `${name}.segment.node.js`;
}

function createRepositoryFilename(name: string): string
{
    return `${name}.segment.repository.js`;
}

export { Files, convertToLocalFilename, convertToRemoteFilename, createNodeFilename, createRepositoryFilename };
