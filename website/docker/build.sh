# Run me from the website root !!

VERSION=$(node -p "require('./package.json').version")

npm ci
npm run build

docker build -t "localhost:5000/jitar.dev:$VERSION" -f docker/Dockerfile .