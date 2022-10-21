
# Jitar | Segmentation example

This example demonstrates how to split an application into multiple segments and
run them distributed using the repository, gateway and nodes.

The application consists of three simple procedures and two segments. All procedures are placed in the
``src/greetings`` directory. 

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

**Hi segment** (terminal 3)
```
npm run node1
```

**Hello segment** (terminal 4)
```
npm run node2
```

The ``requests.http`` file contains example requests to call the procedures.
