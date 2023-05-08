
# Jitar | Cors example

This example demonstrates how to enable CORS.

The application shows a fake weather forecast app.
The procedure is called by an external client (index.html) using Jitar's RPC API.
For serving the HTML file we've created a simple web server.
Because Jitar and the web server both run on a different port, a CORS rule is required to make this work.

## Project setup

**Functions**

* getWeatherForecast (`src/getWeatherForecast.ts`)

**Segments**

* Server - contains the *server* procedures (`segments/server.segment.json`)

**Services**

Development

* Standalone - loads all segments (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next build the application by running the following command.

```bash
npm run build
```

3\. Start web server from the same directory.

```bash
npm run client
```

Go to `http://localhost:8080` in your browser to see the result.
