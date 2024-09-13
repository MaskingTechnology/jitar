
import dotenv from 'dotenv';

export default class Configurator
{
    async configure(filename: string): Promise<void>
    {
        dotenv.config({ path: filename });
    }
}
