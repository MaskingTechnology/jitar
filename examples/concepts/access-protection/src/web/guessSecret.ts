
import checkSecret from '../game/checkSecret';

export default async function guessSecret(secret: string): Promise<string>
{
    const guessed = await checkSecret(secret);

    return guessed ? 'Congratulations!' : 'Sorry, try again!';
}
