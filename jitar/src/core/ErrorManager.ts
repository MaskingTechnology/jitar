
export default class ErrorManager
{
    static handle(error: unknown, name: string, version: string): Error
    {
        const parentMessage = error instanceof Error ? error.message : String(error);
        const newMessage = `${parentMessage}\n[${name} | v${version}]`;

        if (error instanceof Error)
        {
            error.message = newMessage;

            return error;
        }

        return new Error(newMessage);
    }
}
