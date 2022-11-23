
import express from 'npm:express@^4.18.2';
import { Application } from 'npm:@types/express@^4.17.13';
import path from 'https://deno.land/std@0.113.0/node/path.ts';
import { fileURLToPath } from 'https://deno.land/std@0.113.0/node/url.ts';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);
const rootLocation = path.join(fileLocation, '../../../jitar/dist');

export default class JitarController
{
    constructor(app: Application)
    {
        app.use('/jitar', express.static(rootLocation));
    }
}
