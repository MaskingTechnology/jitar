
import dotenv from 'dotenv';

import { FileManager } from '@jitar/sourcing';

export default class Configurator
{
    readonly #fileManager: FileManager;
    
    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }
    
    async configure(filename: string): Promise<void>
    {
        const path = this.#fileManager.getAbsoluteLocation(filename);

        dotenv.config({ path });
    }
}
