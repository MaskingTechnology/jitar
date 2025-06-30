
import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

const information = `
Jitar is a JavaScript Distributed Runtime created and maintained by Masking Technology.

More information can be found at:
- https://jitar.dev
- https://masking.tech
`;

export default class ShowAbout implements Command
{
    readonly name = 'about';
    readonly description = 'Shows information about Jitar.';
    readonly options = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentProcessor): Promise<void>
    {
        console.log(information);
    }
}
