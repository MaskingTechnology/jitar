
import Order from '../orders/Order.js';
import Statistics from './Statistics.js';

export default async function createStatistics(orders: Order[]): Promise<Statistics>
{
    const orderCount = getOrderCount(orders);
    const customerCount = getCustomerCount(orders);
    const revenue = getRevenue(orders);

    return new Statistics(orderCount, customerCount, revenue);
}

function getOrderCount(orders: Order[]): number
{
    return orders.length;
}

function getCustomerCount(orders: Order[]): number
{
    const uniqueCustomers = new Set(orders.map(order => order.customer));

    return uniqueCustomers.size;
}

function getRevenue(orders: Order[]): number
{
    return orders.reduce((revenue, order) => revenue + order.total, 0);
}
