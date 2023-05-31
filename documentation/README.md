
# Jitar | Documentation

The Jitar documentation provides information about the Jitar runtime and its features.
Its targeted at developers who want to use Jitar to build their own applications.

The latest version of the documentation can be found online at [https://docs.jitar.dev](https://docs.jitar.dev).

For the technical implementation of the documentation [Vitepress](https://vitepress.dev) is used.
To run and update the documentation locally, the instruction can be found below.

## Running the documentation

To run the documentation locally, run the following command:

```bash
npm run docs:dev
```

## Updating the documentation

The documentation is written in Markdown. The documentation is split into multiple files. The files are located in the ``docs`` folder.
The files are named after the topics they belong to and grouped in sections to keep them nicely structured.

The menu structure is defined in the `.vitepress/config.ts` file. The file contains the sections and the files that belong to the section.
Vitepress uses file based routing, so the file structure is also the navigation structure.
