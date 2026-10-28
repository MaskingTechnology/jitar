# Run me from the documentation root !!

VERSION=$(jq -r '.version' package.json)

npm ci
npm run docs:build

docker build -t "localhost:5000/docs.jitar.dev:$VERSION" -f docker/Dockerfile .