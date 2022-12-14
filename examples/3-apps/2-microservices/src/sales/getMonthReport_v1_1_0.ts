
import getOrders from '../orders/getOrders_v0_0_0.js';
import createStatistics from './createStatistics_v1_0_0.js';
import formatReport from '../dtp/formatReport_v1_1_0.js';

export default async function getMonthReport(year: number, month: number): Promise<string>
{
    const orders = await getOrders(year, month);
    const statistics = await createStatistics(orders);
    const report = await formatReport(year, month, statistics);

    return report;
}
