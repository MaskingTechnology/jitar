# Run me from the website root !!

VERSION=$(jq -r '.version' package.json)

npm ci
npm run build

docker build -t "localhost:5000/jitar.dev:$VERSION" -f docker/Dockerfile .