
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);

export default class JitarController
{
    constructor(app: express.Application)
    {
        const options =
        {
            index: false
        };

        app.use('/jitar', express.static(fileLocation, options));
    }
}
