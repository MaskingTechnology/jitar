# Run me from the documentation root !!

VERSION=$(jq -r '.version' package.json)

docker build -t "localhost:5000/docs.jitar.dev:$VERSION" -f docker/Dockerfile .