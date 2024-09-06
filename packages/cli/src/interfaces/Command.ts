
import type ArgumentManager from '../ArgumentManager';

export default interface Command
{
    execute(args: ArgumentManager): Promise<void>;
}
