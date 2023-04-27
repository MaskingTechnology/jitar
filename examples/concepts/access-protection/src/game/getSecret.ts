
const SECRET = Math.round(Math.random() * 1000);

console.log('SECRET:', SECRET);

export default async function getSecret(): Promise<string>
{
    return SECRET.toString();
}
