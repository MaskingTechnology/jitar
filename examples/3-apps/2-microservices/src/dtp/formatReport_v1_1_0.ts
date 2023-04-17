
import Statistics from '../sales/Statistics';

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

export default async function formatReport(year: number, month: number, statistics: Statistics): Promise<string>
{
    return `Report ${year} ${months[month - 1]}\n\n#orders: ${statistics.orderCount}\n#customers: ${statistics.customerCount}\nrevenue: ${statistics.revenue}`;
}
