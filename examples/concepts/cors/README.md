
# Jitar | Cors example

This example demonstrates how to enable CORS.

The application contains a single procedure that returns the weather forecast. The index.html file contains a simple form that calls the procedure and displays the result.

## Project setup

**Functions**

* getWeatherForecast (`src/getWeatherForecase.ts`)

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

3\. Start a simple HTTP server from the same directory.

```bash
npm run client
```

Go to `http://localhost:8080` in your browser to see the result.
