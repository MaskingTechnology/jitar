
import Order from './Order.js';
import OrderLine from './OrderLine.js';

import customers from '../customers/customers.js';
import products from '../products/products.js';

const orders =
    [
        new Order("1", customers[0], [new OrderLine("1", products[0], 2), new OrderLine("2", products[1], 2)]),
        new Order("2", customers[1], [new OrderLine("3", products[2], 3)]),
        new Order("3", customers[2], [new OrderLine("4", products[0], 1), new OrderLine("5", products[1], 2), new OrderLine("6", products[2], 3)])
    ];

export default orders;
