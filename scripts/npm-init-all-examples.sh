#!/bin/bash
# set -e

# This script installs and builds all the examples.

EXAMPLES_DIRS="1-basic 2-advanced 3-apps"

echo "#"
echo "# Updating the examples..."
echo "#"

npm_install_and_build()
{
    echo "# Install and build npm packages for $1"

    cd $1
    npm install
    npm run build
    cd ..
}

update_examples()
{
    cd $1

    echo "# Updating $1"

    for dir in ./*/
    do
        npm_install_and_build $dir
    done

    cd ..
}

for dir in $EXAMPLES_DIRS
do
    update_examples "../examples/$dir"
done
