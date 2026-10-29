# Run me from the documentation root !!

VERSION=$(node -p "require('./package.json').version")

docker push "localhost:5000/docs.jitar.dev:$VERSION"