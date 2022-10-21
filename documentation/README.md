
# Jitar | Documentation

The Jitar documentation provides information about the Jitar runtime and its features.
Its targeted at developers who want to use Jitar to build their own applications.

The latest version of the documentation can be found online at [https://docs.jitar.dev](https://docs.jitar.dev).

For the technical implementation of the documentation [Jekyll](https://jekyllrb.com) is used.
To run and update the documentation locally, the instruction can be found below.

## Running the documentation

We use [Docker](https://www.docker.com) for running Jekyll. To run the documentation locally, you need to have Docker installed.
To run the documentation, execute the following command:

```bash
docker-compose -f _docker/docker-compose.yml up
```

The ``docker-compose.yml`` contains all the information for building the image and container.

## Updating the documentation

The documentation is written in Markdown. The documentation is split into multiple files. The files are located in the ``docs`` folder.
The files are named after the section they belong to. The files are prefixed with a number to define the order of the sections.

The menu structure is defined in the ``_data/navigation.yml`` file. The file contains the sections and the files that belong to the section.
The files are defined by the ``path`` property. The ``name`` property defines the title of the section.
