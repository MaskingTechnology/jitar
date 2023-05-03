
export default async function getLuckyNumber(min: number, max: number): Promise<number>
{
    return Math.round(Math.random() * (max - min) + min);
}
