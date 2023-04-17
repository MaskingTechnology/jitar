
import Order from './Order';
import orders from './orders';

export default async function getOrders(year: number, month: number): Promise<Order[]>
{
    return orders;
}
