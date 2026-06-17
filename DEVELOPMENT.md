# Workflow for development

This document describes the workflow we use for the development of Jitar.

## Environment

To work on Jitar, you need the following tools:

- Node.js 22.9 or higher
- npm 11.x or higher
- Code editor (Visual Studio Code recommended)

Note: Jitar is managed as a monorepo with Turbo. You don't need specific knowledge about Turbo to work on Jitar.

## Installation

1. Clone the repository.
1. Run `npm ci` to install all dependencies.

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
1. [CodeRabbit](https://www.coderabbit.ai/) will review your pull request automatically. It is very nitpicky, so don't get discouraged by the number of comments.

## Publishing

To do consistent releases, we use the following steps:

1. Create a new issue and branch.
1. Run `npm run version $VERSION` to update the version numbers for the packages where `$VERSION` is the new version number.
1. Commit and push the changes.
1. Create a pull request.
1. Once the pull request is merged, tag the release.
1. A workflow will be triggered manually to publish the packages.
