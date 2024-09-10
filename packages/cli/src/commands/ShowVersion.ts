
import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

const versionNumber = `v0.8.0`;

export default class ShowVersion implements Command
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentManager): Promise<void>
    {
        console.log(versionNumber);
    }
}
