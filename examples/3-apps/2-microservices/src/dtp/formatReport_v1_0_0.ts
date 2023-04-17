
import Statistics from '../sales/Statistics';

export default async function formatReport(statistics: Statistics): Promise<string>
{
    return `#orders: ${statistics.orderCount}\n#customers: ${statistics.customerCount}\nrevenue: ${statistics.revenue}`;
}
