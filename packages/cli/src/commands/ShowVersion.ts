
import { createRequire } from 'node:module';

import ArgumentProcessor from '../ArgumentProcessor';
import Command from '../Command';

const require = createRequire(import.meta.url);

const PACKAGE_JSON = '../package.json';
const UNKNOWN_VERSION = '0.0.0';

export default class ShowVersion implements Command
{
    readonly name = 'version';
    readonly description = 'Shows the installed version of Jitar.';
    readonly options = [];

    readonly #versionNumber: string;

    constructor()
    {
        this.#versionNumber = this.#getVersionNumber();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentProcessor): Promise<void>
    {
        console.log(`v${this.#versionNumber}`);
    }

    #getVersionNumber(): string
    {
        try
        {
            const { version } = require(PACKAGE_JSON);

            return version ?? UNKNOWN_VERSION;
        }
        catch
        {
            return UNKNOWN_VERSION;
        }
    }
}
