
# Jitar | Microservices example

This example demonstrates how to create a microservices application using Jitar.

The services provide a simple report with sales statistics for a take-out restaurant.

## Running the example

Install all dependencies by running the following command from the root directory of the example.

```
npm install
```

Then build the application from the same directory.

```
npm run build
```

Then start Jitar in development mode with the following command.

```
npm run dev
```

In the requests.http there http requests for our services. The first runs version 1.0.0 and the second runs version 1.1.0. Both versions are availble and run simultaneously.

## Running in production

In this section we will describe the different deployment models that can easliy be done with jitar. The segment configuration is the important part of this section.

### Running as a monolith

The first configuration we demonstrate is the monolith approach. All segments are hosted on a single node so a single server contains all components from the application. We need two terminal session to get this configuration started. The starting order is of importance.

**Repository** (terminal 1)
```
npm run repo
```

**Node** (terminal 2)
```
npm run node
```

Check terminal 2 to see the incoming requests. Only the sales/getMonthReport is visible in the log as the other requests are all internal.

```log
2022-10-18 18:19:57.884  INFO  [#run] Ran procedure -> sales/getMonthReport (1.1.0) 
2022-10-18 18:19:58.179  INFO  [#run] Ran procedure -> sales/getMonthReport (1.1.0)
```

### Running as duplicated monoliths

When the load on the monolith is too much, we can decide to duplicate the monolith. We can do this by adding a gateway and duplicate the node configuration. To run the application, we need four terminal sessions to start the repository, gateway, and the nodes separately. The starting order is of importantance.

**Repository** (terminal 1)
```
npm run repo
```

**Gateway** (terminal 2)
```
npm run gateway
```

**Node-1** (terminal 3)
```
npm run node1
```

**Node-2** (terminal 4)
```
npm run node2
```

Now run the requests in the requests file again. The gateway balances the load between the servers, but we don't really have microservices.

### Running as microservices

For many reasons, the monolith approach might not be the best for the current situation and we want to distribute each segment on its own server. To do this, we need five terminals to get the configuration started.

**Repository** (terminal 1)
```
npm run repo
```

**Gateway** (terminal 2)
```
npm run gateway
```

**Node-orders** (terminal 3)
```
npm run orders
```

**Node-sales** (terminal 4)
```
npm run sales
```

**Node-dtp** (terminal 4)
```
npm run dtp
```

Run the requests again and see the terminals for log information. The gateway now shows a variaty of calls made to the distributed nodes.

```log
2022-10-18 18:31:53.091  INFO  [#run] Ran procedure -> orders/getOrders (0.0.0) 
2022-10-18 18:31:53.123  INFO  [#run] Ran procedure -> dtp/formatReport (1.1.0) 
2022-10-18 18:31:53.127  INFO  [#run] Ran procedure -> sales/getMonthReport (1.1.0)
```
