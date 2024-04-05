# Workflow for development

This document describes the workflow we use for the development of Jitar.

## Environment

To work on Jitar, you need the following tools:

- Node.js 20.x or higher
- npm 10.x or higher
- Visual Studio Code
- Docker (optional) for running the full stack example

Note: Jitar is managed as a monorepo with Lerna. You don't need specific knowledge about Lerna to work on Jitar.

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
1. Commit and push the changes.
1. Create a pull request.

## Publishing

To do consistent releases, we use the following steps:

1. Create a new issue and branch.
1. Update the version number for the mono repo in the `package.json` file.
1. Update the version number for all packages in the packages directory.
1. Execute command `npm run changelog` to generate a changelog.
1. Commit and push the changes.
1. Execute command `npm run publish` to publish the packages.
1. Commit and push the changes.
1. Create pull request.
1. Merge the pull request.
1. Create a new tag with the version number.
