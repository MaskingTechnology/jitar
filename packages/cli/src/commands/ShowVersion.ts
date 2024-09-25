
import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

const versionNumber = `v0.8.0`;

export default class ShowVersion implements Command
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentProcessor): Promise<void>
    {
        console.log(versionNumber);
    }
}
