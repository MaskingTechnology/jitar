
import type ArgumentProcessor from './ArgumentProcessor';

interface Command
{
    execute(args: ArgumentProcessor): Promise<void>;
}

export default Command;
