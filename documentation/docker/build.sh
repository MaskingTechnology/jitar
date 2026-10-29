# Run me from the documentation root !!

VERSION=$(node -p "require('./package.json').version")

npm ci
npm run docs:build

docker build -t "localhost:5000/docs.jitar.dev:$VERSION" -f docker/Dockerfile .