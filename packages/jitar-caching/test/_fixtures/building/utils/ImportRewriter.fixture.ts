
const NO_SYSTEM_IMPORTS =
`import './path/to/file.js';
import component from '/path/to/component.js;';
import { component1, component2 } from '../path/to/components.js';
`;

const NO_SYSTEM_IMPORTS_RESULT = NO_SYSTEM_IMPORTS;

const HAS_SYSTEM_IMPORTS =
`import * as fs from 'fs';
import component from 'http';
import { component1, component2 } from 'https';
`;

const HAS_SYSTEM_IMPORTS_RESULT =
`import { getDependency } from "/jitar/hooks.js";
const fs = await getDependency('fs');
const component = await getDependency('http');
const { component1, component2 } = await getDependency('https');
`;

const HAS_JITAR_IMPORTS = `import { runProcedure } from 'jitar';`;

const HAS_JITAR_IMPORTS_RESULT =
`import { getDependency } from "/jitar/hooks.js";
import { runProcedure } from "/jitar/hooks.js";`;

const HAS_IMPORT_NO_SEMICOLON = `import { runProcedure } from 'jitar'`;

const HAS_IMPORT_NO_SEMICOLON_RESULT =
`import { getDependency } from "/jitar/hooks.js";
import { runProcedure } from "/jitar/hooks.js";`;

const HAS_MIXED_IMPORTS =
`import component from './path/to/component.js';
import os from 'os';
import { runProcedure } from 'jitar';
import main, { some as other } from 'library';
`;

const HAS_MIXED_IMPORTS_RESULT =
`import { getDependency } from "/jitar/hooks.js";
import component from './path/to/component.js';
const os = await getDependency('os');
import { runProcedure } from "/jitar/hooks.js";
const { default: main, some: other } = await getDependency('library');
`;

const HAS_DYNAMIC_IMPORTS =
`import component from './path/to/component.js';
const os = await import('os');
`;

const HAS_DYNAMIC_IMPORTS_RESULT = HAS_DYNAMIC_IMPORTS;

const HAS_IMPORTS_AND_CONTENT =
`import os from 'os';

export default function test() {}

import { runProcedure } from 'jitar';
`;

const HAS_IMPORTS_AND_CONTENT_RESULT =
`import { getDependency } from "/jitar/hooks.js";
const os = await getDependency('os');

export default function test() {}

import { runProcedure } from "/jitar/hooks.js";
`;

const INPUTS =
{
    NO_SYSTEM_IMPORTS,
    HAS_SYSTEM_IMPORTS,
    HAS_JITAR_IMPORTS,
    HAS_IMPORT_NO_SEMICOLON,
    HAS_MIXED_IMPORTS,
    HAS_DYNAMIC_IMPORTS,
    HAS_IMPORTS_AND_CONTENT
}

const OUTPUTS =
{
    NO_SYSTEM_IMPORTS_RESULT,
    HAS_SYSTEM_IMPORTS_RESULT,
    HAS_JITAR_IMPORTS_RESULT,
    HAS_IMPORT_NO_SEMICOLON_RESULT,
    HAS_MIXED_IMPORTS_RESULT,
    HAS_DYNAMIC_IMPORTS_RESULT,
    HAS_IMPORTS_AND_CONTENT_RESULT
}

export { INPUTS, OUTPUTS }
