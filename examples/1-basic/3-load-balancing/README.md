
# Jitar | Load Balancing example

This example demonstrates how to load balance application segments by running them on multiple nodes.

The application contains the simple procedure from the "Hello World" example.
It can be found in the ``src/greetings`` directory. 

Because this example has multiple segment files all the segment files ``(*.segment.json)`` are placed in the ``segments`` directory. The same is done for the configurations, as there are multiple configurations used.

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importantance.

**Repository** (terminal 1)
```
npm run repo
```

**Gateway** (terminal 2)
```
npm run gateway
```

**Node 1** (terminal 3)
```
npm run node1
```

**Node 2** (terminal 4)
```
npm run node2
```

The ``requests.http`` file contains example request to call the procedure.
Note that the requests are handled round robin by both nodes.
