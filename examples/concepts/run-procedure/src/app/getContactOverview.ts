
// This is a simple example of how to use the runProcedure function to call a version of a procedure dynamically.
// These dynamic calls are very powerful for dynamic version switching, but they break the type safety of TypeScript and
// increase the complexity of debugging. Use them with caution.

import { contacts } from '../stubs/data.js';

export default async function getContactOverview()
{
    let result = '';

    for (const contact of contacts)
    {
        result += await __runProcedure('contact/printContactInformation', contact.version, { 'contact': contact }, undefined) + '\n\n';
    }

    return result;
}
