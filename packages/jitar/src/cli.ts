#!/usr/bin/env node

import { Cli } from '@jitar/cli';
import { Logger } from '@jitar/logging';

try
{
    const cli = new Cli();

    await cli.start();
}
catch (error: unknown)
{
    const logger = new Logger();
    const message = error instanceof Error ? error.message : String(error);

    logger.fatal(message);
}
