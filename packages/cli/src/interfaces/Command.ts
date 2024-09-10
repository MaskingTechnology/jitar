
import type ArgumentManager from '../ArgumentManager';

interface Command
{
    execute(args: ArgumentManager): Promise<void>;
}

export default Command;
