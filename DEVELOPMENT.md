# Workflow for development

This document describes the workflow we use for the development of Jitar.

## Environment

To work on Jitar, you need the following tools:

- Node.js 20.x or higher
- npm 11.x or higher
- Code editor (Visual Studio Code recommended)
- Docker (optional) for running the full-stack example

Note: Jitar is managed as a monorepo with Turbo. You don't need specific knowledge about Turbo to work on Jitar.

## Installation

1. Clone the repository.
1. Run `npm install` to install all dependencies.

## Development

1. Run `npm run build` to build all packages.
1. Run `npm run test` to run all tests.
1. Run `npm run lint` to lint all packages.

## Creating a pull request

1. Create a new issue and branch.
1. Make your changes.
1. Update the [documentation](./documentation/README.md) if necessary.
1. Run `npm run build` to build all packages.
1. Run `npm run review` to run all tests and linting.
1. Run `npm run changeset` to create a changeset for your changes.
1. Commit and push the changes.
1. Create a pull request.
1. [CodeRabbit](https://www.coderabbit.ai/) will review your pull request automatically. It is very nitpicky, so don't get discouraged by the number of comments.

## Publishing

To do consistent releases, we use the following steps:

1. Create a new issue and branch.
1. Update the version number for the mono repo in the `package.json` file.
1. Run `npm run publish-packages` to build and publish all packages.
1. Create a pull request.
1. Once the pull request is merged, tag the release.
