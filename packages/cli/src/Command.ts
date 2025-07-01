
import type ArgumentProcessor from './ArgumentProcessor';
import type Option from './Option';

interface Command
{
    readonly name: string;
    readonly description: string;
    readonly options: Option[];

    execute(args: ArgumentProcessor): Promise<void>;
}

export default Command;
