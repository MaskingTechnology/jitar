
# Jitar | Contact list

This example contact list application is build with build with React, MongoDB and Jitar (ReMoJi stack).
It includes frontend and backend components and a database for storing contacts.

If you want to create a new application with the same setup, you can use the following command.

```
npm create jitar@latest
```

Then type the name of the project and select the frontend framework you want.

## Running the example

For running the example, Docker is required for setting up MongoDB.

1 Install all dependencies by running the following command from the root directory of the example.

```
npm install
```

2 Build the application from the same directory.

```
npm run build
```

3 Start MongoDB with docker-compose.

```
docker-compose up
```

4 Start Jitar in development mode with the following command.

```
npm run standalone
```

5 Open the following URL in your browser `http://localhost:3000`

The example uses our Vite plugin. To run Vite in dev mode (for HMR) use the following command.

```
npm run dev
```

The app is now also available under `http://localhost:5173/`.
Note that the Jitar instance needs to run beside Vite, otherwise the backend components won't be available.

## Running in production

To run the application in production mode, we need four terminal sessions to start the repository, gateway, and node and proxy (as webserver) separately. The starting order is of importance.

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
