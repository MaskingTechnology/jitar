
import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

const versionNumber = 'v0.10.3';

export default class ShowVersion implements Command
{
    readonly name = 'version';
    readonly description = 'Shows the installed version of Jitar.';
    readonly options = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentProcessor): Promise<void>
    {
        console.log(versionNumber);
    }
}
