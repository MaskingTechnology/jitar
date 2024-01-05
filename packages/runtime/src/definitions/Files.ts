
const Files =
{
    MODULE_PATTERN: '**/*.js',
    SEGMENT_PATTERN: '**/*.segment.json',
    NODE_SEGMENT_PATTERN: '**/*.segment.node.js',
    REPOSITORY_SEGMENT_PATTERN: '**/*.segment.repository.js'
};

Object.freeze(Files);

const EXTENSION_PATTERN = /\.js$/;

function convertToLocalFilename(filename: string): string
{
    return filename.replace(EXTENSION_PATTERN, '.local.js');
}

function convertToRemoteFilename(filename: string): string
{
    return filename.replace(EXTENSION_PATTERN, '.remote.js');
}

function createNodeFilename(name: string): string
{
    return `./${name}.segment.node.js`;
}

function createRepositoryFilename(name: string): string
{
    return `./${name}.segment.repository.js`;
}

function isSegmentFilename(filename: string): boolean
{
    return filename.includes('.segment.');
}

export { Files, convertToLocalFilename, convertToRemoteFilename, createNodeFilename, createRepositoryFilename, isSegmentFilename };
