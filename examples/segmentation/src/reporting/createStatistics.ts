
type Statistics = { sum: number, average: number };

export default async function createStatistics(data: number[]): Promise<Statistics>
{
    const sum = data.reduce((a, b) => a + b, 0);
    const average = sum / data.length;

    return { sum, average };
}
