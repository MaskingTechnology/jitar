---
layout: doc

prev:
    text: State management
    link: /develop/state-management

next:
    text: Set up and tear down
    link: /develop/setup-and-teardown

---

# Data consistency

Maintaining data consistency in distributed applications is important. It's also complex and sophisticated because the implementation requires a high degree of coordination and communication between the servers that are participating in a transaction.

Jitar significantly simplifies this by automating all coordination and communication. For Jitar applications, the [SAGA pattern](https://microservices.io/patterns/data/saga.html){target="_blank"} is a perfect fit. In this section you'll learn how we use this pattern.

## Setting up a SAGA

The basic setup of a SAGA is simple. Just execute a sequence of actions, and if one of them fails, execute compensation actions. Let's look the implementation of an order process for a small online store.

```ts
export async function placeOrder(productIds: string[], address: string): Promise<Delivery>
{
    const products = await getProducts(productIds);
    await updateStock(productIds);
    const order = await createOrder(products);
    return planDelivery(address, order);
}
```

The process has four actions that lead to a final result. To convert this implementation to a SAGA we need to wrap the actions in a `try / catch` block and add compensating actions like this.

```ts
export async function placeOrder(productIds: string[], address: string): Promise<void>
{
    let products: Product[];
    let order: Order;

    try
    {
        // execute all actions
        products = await getProducts(productIds);
        await updateStock(productIds);
        order = await createOrder(products);
        return planDelivery(address, order);
    }
    catch (error: unknown)
    {
        // execute compensating actions
        const undoActions = [];

        if (products !== undefined)
        {
            undoActions.push(resetStock(productIds));
        }

        if (order !== undefined)
        {
            undoActions.push(cancelOrder(order));
        }

        await Promise.allSettled(undoActions);

        throw error;
    }
}
```

When an error occurs, we don't know which action has failed, so make sure to check what compensation actions need to be executed. If the compensating actions can be executed asynchronously, we like to wrap them in a promise. 

## When to use

We recommend always applying this pattern, but it's only required in case one or more actions are placed in another segment. If all segments are placed in the same segment, you could use database transactions or some [unit-of-work](https://www.martinfowler.com/eaaCatalog/unitOfWork.html){target="_blank"} implementation. We don't favor this approach because you need to refactor your code if your segmentation strategy changes. Also, we like to be consistent and use the same strategy everywhere.
