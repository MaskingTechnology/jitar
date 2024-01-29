
import checkSecret from '../game/checkSecret';

export default async function guessSecret(secret: string): Promise<string>
{
    const number = Number(secret);

    const isGuessed = await checkSecret(number);

    return isGuessed ? 'Congratulations!' : 'Sorry, try again!';
}
