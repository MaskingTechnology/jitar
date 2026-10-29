# Run me from the website root !!

VERSION=$(node -p "require('./package.json').version")

docker push "localhost:5000/jitar.dev:$VERSION"