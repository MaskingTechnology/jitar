# Run me from the website root !!

VERSION=$(jq -r '.version' package.json)

docker push "localhost:5000/jitar.dev:$VERSION"