# Run me from the website root !!

set -e

VERSION=$(node -p "require('./package.json').version")

npm ci
npm run build

docker build -t "localhost:5000/jitar.dev:$VERSION" -f docker/Dockerfile .