
import getData from './getData';
import createStatistics from './createStatistics';

export default async function createReport(): Promise<string>
{
    // This procedure will be called remotely in production mode
    // because its placed in another segment.
    const data = await getData();
    
    // This procedure will always be called locally because its
    // in the same segment.
    const statistics = await createStatistics(data);

    return `Total: ${statistics.sum}, Average: ${statistics.average}`;
}
