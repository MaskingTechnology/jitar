# Run me from the documentation root !!

VERSION=$(jq -r '.version' package.json)

docker push "localhost:5000/docs.jitar.dev:$VERSION"