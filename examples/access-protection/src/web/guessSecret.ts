
import checkSecret from '../game/secret/checkSecret';

export default async function guessSecret(secret: number): Promise<string>
{
    const isGuessed = await checkSecret(secret);

    return isGuessed ? 'Congratulations!' : 'Sorry, try again!';
}
