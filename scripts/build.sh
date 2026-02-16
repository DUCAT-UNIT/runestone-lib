#!/bin/bash

set -e

DIRECTORY="./dist"

# Clean the existing dist directory.
rm -rf "$DIRECTORY"
mkdir -p "$DIRECTORY"

# Copy and format the package.json file.
cp package.json "$DIRECTORY/package.json"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s#$DIRECTORY#.#g" "$DIRECTORY/package.json"
else
    sed -i "s#$DIRECTORY#.#g" "$DIRECTORY/package.json"
fi

echo "Running TypeScript compiler..."
npx tsc
if [ $? -ne 0 ]; then
    echo "TypeScript build failed."
    exit 1
fi

echo "Build completed successfully."
