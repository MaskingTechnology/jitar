
/*
 * Procedures can be dynamically imported and called using the runProcedure hook.
 *
 * Note 1: Only procedures that are added to a segment file can be called.
 * Note 2: Using this hook breaks the IntelliSense support and will make your application dependent on Jitar.
 */

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const hiMessage = await __runProcedure('greetings/sayHi', '0.0.0', { 'firstName': firstName });
    const helloMessage = await __runProcedure('greetings/sayHello', '0.0.0', { 'firstName': firstName, 'lastName': lastName });

    return `${hiMessage}\n${helloMessage}`;
}
