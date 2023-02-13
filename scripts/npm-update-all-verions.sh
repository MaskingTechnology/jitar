#!/bin/bash
# set -e

# This script updates all versions of jitar related packages.

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
EXAMPLES_DIRS="1-basic 2-advanced 3-apps"
PACKAGE_DIRS="jitar jitar-nodejs-server jitar-vite-plugin"

update_package_json()
{
    sed -i '' 's#"version": "'"$CURRENT_VERSION"'"#"version": "'"$NEW_VERSION"'"#' package.json
    sed -i '' 's#"jitar": "^'"$CURRENT_VERSION"'"#"jitar": "^'"$NEW_VERSION"'"#' package.json
    sed -i '' 's#"jitar-nodejs-server": "^'"$CURRENT_VERSION"'"#"jitar-nodejs-server": "^'"$NEW_VERSION"'"#' package.json
    sed -i '' 's#"jitar-vite-plugin": "^'"$CURRENT_VERSION"'"#"jitar-vite-plugin": "^'"$NEW_VERSION"'"#' package.json
}

update_file()
{
    cd $1

    echo "# Updating $1"

    update_package_json

    cd ..
}

update_example()
{
    cd $1

    echo "# Updating $1"

    for dir in ./*/
    do
        update_file $dir
    done

    cd ..
}

update_examples()
{
    echo "# Updating examples"
    
    cd "../examples"

    for dir in $EXAMPLES_DIRS
    do
        update_example $dir
    done

    cd ../scripts
}

update_package()
{
    cd $1

    echo "# Updating $1"

    update_package_json

    cd ..
}

update_packages()
{
    echo "# Updating packages"

    cd "../packages"

    for dir in $PACKAGE_DIRS
    do
        update_file $dir
    done

    cd ../scripts
}

echo "What is the current version?"
read CURRENT_VERSION
echo "What is the new version?"
read NEW_VERSION

echo "Updating all versions from $CURRENT_VERSION to $NEW_VERSION"

cd $SCRIPT_DIR

update_examples
update_packages
