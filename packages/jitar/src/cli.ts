#!/usr/bin/env node

import { CliManager } from '@jitar/cli';

try
{
    const cliManager = new CliManager();
    cliManager.manage();
}
catch (error: unknown)
{
    console.error('Epic fail');
}
