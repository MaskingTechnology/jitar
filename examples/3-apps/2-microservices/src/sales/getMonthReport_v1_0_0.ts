
import getOrders from '../orders/getOrders_v0_0_0.js';
import createStatistics from './createStatistics_v1_0_0.js';
import formatReport from '../dtp/formatReport_v1_0_0.js';

export default async function getMonthReport(): Promise<string>
{
    const orders = await getOrders(2020, 1);
    const statistics = await createStatistics(orders);
    const report = await formatReport(statistics);

    return report;
}
