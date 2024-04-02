To do consistent releases, we use the following steps:

1. Create a new issue and branch.
1. Update the version number for the mono repo in the `package.json` file.
1. Update the version number for all packages in the packages directory.
1. Execute command `npm run changelog` to generate a changelog.
1. Commit and push the changes.
1. Execute command `npx lerna publish --no-git-tag-version --no-private` to publish the packages.
1. Commit and push the changes.
1. Create pull request.
1. Merge the pull request.
1. Create a new tag with the version number.
