
# Jitar | Website

The Jitar website provides information about the Jitar runtime and its features.
Its targeted at developers who want to use Jitar to build their own applications.

The latest version of the website can be found online at [https://jitar.dev](https://jitar.dev).

To run and update the website locally, the instruction can be found below.

## Building the website

To run the website locally, you need to have [Node.js](https://nodejs.org) installed.
To build the website, execute the following commands:

```bash
npm install
npm run build
```

The website can be served from the ``dist`` folder.
We use the [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for Visual Studio Code to run the website locally.

## Updating the website

The website is written in plain HTML, CSS and JavaScript. Its files are located in the ``src`` folder.
For developing and testing the website it can also be served from the ``src`` folder.