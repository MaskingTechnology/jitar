
const noSystemImports =
    `import './path/to/file.js';
import component from '/path/to/component.js;';
import { component1, component2 } from '../path/to/components.js';
`;

const noSystemImportsResult = noSystemImports;

const hasSystemImports =
    `import * as fs from 'fs';
import component from 'http';
import { component1, component2 } from 'https';
`;

const hasSystemImportsResult =
    `import { getDependency } from "/jitar/hooks.js";
const fs = await getDependency('fs');
const { default: component } = await getDependency('http');
const { component1, component2 } = await getDependency('https');
`;

const hasJitarImports = `import { runProcedure } from 'jitar';`;

const hasJitarImportsResult =
    `import { getDependency } from "/jitar/hooks.js";
import { runProcedure } from "/jitar/hooks.js";`;

const hasImportsNoSemicolon = `import { runProcedure } from 'jitar'`;

const hasImportsResultNoSemicolon =
    `import { getDependency } from "/jitar/hooks.js";
import { runProcedure } from "/jitar/hooks.js";`;

const hasMixedImports =
    `import component from './path/to/component.js';
import os from 'os';
import { runProcedure } from 'jitar';
`;

const hasMixedImportsResult =
    `import { getDependency } from "/jitar/hooks.js";
import component from './path/to/component.js';
const { default: os } = await getDependency('os');
import { runProcedure } from "/jitar/hooks.js";
`;

const hasDynamicImports =
    `import component from './path/to/component.js';
const os = await import('os');
`;

const hasDynamicImportsResult = hasDynamicImports;

const hasImportsAndContent =
    `import os from 'os';

export default function test() {}

import { runProcedure } from 'jitar';
`;

const hasImportsAndContentResult =
    `import { getDependency } from "/jitar/hooks.js";
const { default: os } = await getDependency('os');

export default function test() {}

import { runProcedure } from "/jitar/hooks.js";
`;

export
{
    noSystemImports, noSystemImportsResult,
    hasSystemImports, hasSystemImportsResult,
    hasJitarImports, hasJitarImportsResult,
    hasImportsNoSemicolon, hasImportsResultNoSemicolon,
    hasMixedImports, hasMixedImportsResult,
    hasDynamicImports, hasDynamicImportsResult,
    hasImportsAndContent, hasImportsAndContentResult
}
