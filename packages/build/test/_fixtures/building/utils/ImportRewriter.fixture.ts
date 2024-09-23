
// With .js extension
const APPLICATION_IMPORTS =
`import './path/to/file.js';
import component from '/path/to/component.js';
import { component1, component2 } from '../path/to/components.js';
`;

const APPLICATION_IMPORTS_RESULT =
`await __import("/components/path/to/file.js", "application");
const component = await __import("/components/path/to/component.js", "application", true);
const { component1, component2 } = await __import("/path/to/components.js", "application", false);
`;

const RUNTIME_IMPORTS =
`import 'polyfills';
import * as fs from 'fs';
import component from 'http';
import { component1, component2 } from 'https';
`;

const RUNTIME_IMPORTS_RESULT =
`await __import("polyfills", "runtime");
const fs = await __import("fs", "runtime", true);
const component = await __import("http", "runtime", true);
const { component1, component2 } = await __import("https", "runtime", false);
`;

const IMPORT_WITHOUT_SEMICOLON = `import { runProcedure } from 'jitar'`;

const IMPORT_WITHOUT_SEMICOLON_RESULT = `const { runProcedure } = await __import("jitar", "runtime", false);`;

// Without .js extension
const MIXED_IMPORTS =
`import component from './path/to/component';
import os from 'os';
import { runProcedure } from 'jitar';
import main, { some as other } from 'library';
`;

const MIXED_IMPORTS_RESULT =
`const component = await __import("./components/path/to/component.js", "application", true);
const os = await __import("os", "runtime", true);
const { runProcedure } = await __import("jitar", "runtime", false);
const { default : main, some : other } = await __import("library", "runtime", false);
`;

const DYNAMIC_IMPORTS =
`import component from './path/to/component.js';
const os = await import('os');
`;

const DYNAMIC_IMPORTS_RESULT =
`const component = await __import("./components/path/to/component.js", "application", true);
const os = await import('os');
`;

const IMPORTS_AND_CONTENT =
`import os from 'os';

export default function test() {}

import { runProcedure } from 'jitar';
`;

const IMPORTS_AND_CONTENT_RESULT =
`const os = await __import("os", "runtime", true);

export default function test() {}

const { runProcedure } = await __import("jitar", "runtime", false);
`;

const INPUTS =
{
    APPLICATION_IMPORTS,
    RUNTIME_IMPORTS,
    IMPORT_WITHOUT_SEMICOLON,
    MIXED_IMPORTS,
    DYNAMIC_IMPORTS,
    IMPORTS_AND_CONTENT
};

const OUTPUTS =
{
    APPLICATION_IMPORTS_RESULT,
    RUNTIME_IMPORTS_RESULT,
    IMPORT_WITHOUT_SEMICOLON_RESULT,
    MIXED_IMPORTS_RESULT,
    DYNAMIC_IMPORTS_RESULT,
    IMPORTS_AND_CONTENT_RESULT
};

const SOURCE_FILE = './components/test.js';

export { INPUTS, OUTPUTS, SOURCE_FILE };
