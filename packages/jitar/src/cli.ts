#!/usr/bin/env node

import process from 'node:process';

import { Cli } from '@jitar/cli';
import { Logger } from '@jitar/logging';

const logger = new Logger();

try
{
    const cli = new Cli();

    await cli.start();
}
catch (error: unknown)
{
    logger.fatal(error);

    process.exitCode = 1;
}
