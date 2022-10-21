
import Order from './Order.js';
import orders from './orders.js';

export default async function getOrders(year: number, month: number): Promise<Order[]>
{
    return orders;
}
