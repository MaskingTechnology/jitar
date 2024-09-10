
import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

const information = `
Jitar is a JavaScript Distributed Runtime created and maintained by Masking Technology.

More information can be found at:
- https://jitar.dev
- https://masking.tech
`;

export default class ShowAbout implements Command
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentManager): Promise<void>
    {
        console.log(information);
    }
}
