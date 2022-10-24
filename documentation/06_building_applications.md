---
layout: default
title: Building applications
---

# Building applications

In this section we will take a look at the basics of building an application that effectively leverages the benefits of Jitar. All application examples are available on [GitHub](https://github.com/MaskingTechnology/jitar){:target="_blank"} as separate projects.

---

## Components

Jitar has two types of components as primary building blocks for applications:

1. **Procedure** - contains logic (written as functions)
1. **Object** - contains data (arrays, maps, class objects, etc)

This means that applications that run on Jitar are [procedural](https://en.wikipedia.org/wiki/Procedural_programming){:target="_blank"} by nature. They are composed of procedures that can be called by other procedures or clients. The use of classes and objects is supported, but only as data types or utilities. Their functions can not be called remotely.

An example of this is the ``sayBoth`` procedure from the [data transportation example](04_basic_features#data-transportation) on the basic features page. This example uses a ``Person`` class to pass the name to the ``sayHi`` and ``sayHello`` procedures.

{:.filename}
src/greetings/sayBoth.ts

```ts
import Person from './Person.js';

import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const person = new Person(firstName, lastName);

    const hiMessage = await sayHi(person);
    const helloMessage = await sayHello(person);

    return `${hiMessage}\n${helloMessage}`;
}
```

---

## Full stack

One of the application types that suits Jitar very well are full stack applications. These applications span the whole stack from the client to the server and back. This means that the application can be used as a web application, desktop application or mobile application.

Because Jitar is framework agnostic, it can be used with any framework or library. For our example application we will use [React](https://reactjs.org/){:target="_blank"} as a client framework and [MongoDB](https://www.mongodb.com/){:target="_blank"} as a database. Jitar will handle the communication between the client and the server, so we don't need an API framework like [Express](https://expressjs.com/){:target="_blank"}. We call this the **ReMoJi** stack :-)

Time to dive in! The example is a simple contact list. We've excluded some files for brevity, but the full code can be found on [GitHub](https://github.com/MaskingTechnology/jitar){:target="_blank"}.

Let's start with setting up the client. To keep things simple, we use a CDN for importing React.

{:.filename}
src/index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script src="./client.js" type="module"></script>
    </body>
</html>
```

Setting up the React is pretty straight forward. We only need to create and use a Jitar client for importing the main ``App`` component so it gets hooked to the repository.

{:.filename}
src/client.tsx

```tsx
// @ts-ignore (the import will be valid at runtime)
import { startClient } from '/jitar/client.js';

const client = await startClient();

const { App } = await client.import('./app/App.js');
const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
```

The ``App`` component loads the contacts from the server and displays them in the list. 

{:.filename}
src/app/App.tsx

```tsx
import Contact from './Contact.js';
import getContacts from './getContacts.js';
import ContactView from './ContactView.js';

export function App(props: any)
{
    const [contacts, setContacts] = React.useState<Contact[]>([]);

    const initContacts = () => getContacts().then(contacts => setContacts(contacts));

    React.useEffect(initContacts, []);
    
    return contacts.length > 0
        ? contacts.map((contact: any) => <ContactView key={contact.id} contact={contact} />)
        : <div>No contacts</div>;
}
```

On the other end we can directly access the database to retrieve the data.

{:.filename}
src/app/getContacts.ts

```ts
import { MongoClient } from 'mongodb';

import Contact from './Contact.js';

export default async function getContacts(): Promise<Contact[]>
{
    const mongo = await MongoClient.connect(process.env.DB_STRING);
    const entries = await mongo
        .db('react_mongo')
        .collection('contacts')
        .find().toArray();

    return entries.map(contact => new Contact(
        contact._id.toHexString(),
        contact.name, contact.address,
        contact.phone, contact.email
    ));
}
```

That's it! We have a full stack application. The only thing we need to do is to configure the server segment.

{:.filename}
segments/server.segment.json

```json
{
    "./app/getContacts.js": {
        "default": {
            "access": "public"
        }
    }
}
```

The full example has a bit more body than this. It also has configurations for running it distributed and load balanced.

---

## Microservices

An architecture type that suits Jitar very well is the microservices architecture. Splitting applications into smaller pieces makes them easier to maintain and scale. To make this work we need to split the application into multiple segments. Each segment can be deployed independently and can be scaled independently.

Jitar allows flexible segmentation, so an application can be decomposed in any way. The decomposition strategy can be changed at any time because it only lives at the configuration level. We will use a [subdomain based decomposition](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html){:target="_blank"} for this example. This means that each segment represents a separate subdomain.

The example is a simple webshop. We've excluded some files for brevity, but the full code can be found on [GitHub](https://github.com/MaskingTechnology/jitar){:target="_blank"}. The following segments are used:

* **Orders** - contains everything concerning orders
* **Sales** - contains everything concerning sales
* **DTP** - contains everything concerning publishing

We've modularized the application the same way to align the code with the segments. We will look at the process of getting a monthly report for the sales department.

{:.filename}
src/sales/getMonthReport.ts

```ts
import getOrders from '../orders/getOrders.js';
import createStatistics from './createStatistics.js';
import formatReport from '../dtp/formatReport.js';

export default async function getMonthReport(year: number, month: number): Promise<string>
{
    const orders = await getOrders(year, month);
    const statistics = await createStatistics(orders);
    return await formatReport(statistics);
}
```

The process starts at the sales segment. It gets the orders from the orders segment.

{:.filename}
src/orders/getOrders.ts

```ts
import Order from './Order.js';

export default async function getOrders(year: number, month: number): Promise<Order[]>
{
    // Get orders from database
}
```

Next it creates statistics from the orders. Creating the statistics is decomposed into several steps. Since these steps do not need to be reusable (yet), we've chosen to keep them in the same file. We see this as a best practice. If steps are reusable, they should be moved to a separate file.

{:.filename}
src/sales/createStatistics.ts

```ts
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
```

The statistics are formatted by the DTP segment. The example outputs a simple string, but it could be a PDF or any other format.

{:.filename}
src/dtp/formatReport.ts

```ts
import Statistics from '../sales/Statistics.js';

export default async function formatReport(statistics: Statistics): Promise<string>
{
    return `#orders: ${statistics.orderCount}\n#customers: ${statistics.customerCount}\nrevenue: ${statistics.revenue}`;
}
```

That's it for the code. Now we need to configure the segments. We will start with the sales segment.

{:.filename}
segments/sales.segment.json

```json
{
    "./sales/getMonthReport.js": {
        "default": {
            "access": "public"
        }
    }
}
```

Then we configure the orders segment.

{:.filename}
segments/orders.segment.json

```json
{
    "./orders/getOrders.js": {
        "default": {
            "access": "public"
        }
    }
}
```

And lastly we configure the DTP segment.

{:.filename}
segments/dtp.segment.json

```json
{
    "./dtp/formatReport.js": {
        "default": {
            "access": "public"
        }
    }
}
```

The full example has more segments and provides all the configurations and has multiple versions of the procedures.

---

{:.previous-chapter}
[Advanced features](05_advanced_features)

{:.next-chapter}
[Deployment](07_deployment)
