#!/usr/bin/env node

import { CliManager } from '@jitar/cli';
import { Logger } from '@jitar/logging';

const logger = new Logger();

try
{
    const cliManager = new CliManager();
    await cliManager.manage();
}
catch (error: unknown)
{
    const message = error instanceof Error ? error.message : String(error);

    logger.fatal(message);
}
