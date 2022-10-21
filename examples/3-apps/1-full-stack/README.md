
# Jitar | Full Stack example

This example demonstrates how to create a full stack application using Jitar.

The application is a simple contact list build with the ReMoJi stack (React, MongoDB, Jitar).

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

Now open the following URL in your browser ``http://localhost:3000``

## Running in production

To run the application in production mode, we need four terminal sessions to start the repository, gateway, and node and proxy (as webserver) separately. The starting order is of importantance.

**Repository** (terminal 1)
```
npm run repo
```

**Gateway** (terminal 2)
```
npm run gateway
```

**Node** (terminal 3)
```
npm run node
```

**Proxy** (terminal 4)
```
npm run proxy
```

Now open the following URL in your browser ``http://localhost:8080``
