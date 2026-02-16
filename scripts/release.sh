#!/bin/bash

# Usage: ./scripts/release.sh
# Reads version from package.json and tags current commit.

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed"
    exit 1
fi

if ! git rev-parse --git-dir &> /dev/null; then
    echo "Not in a git repository"
    exit 1
fi

if ! git remote get-url origin &> /dev/null; then
    echo "No 'origin' remote found"
    exit 1
fi

get_package_version() {
    node -p "require('./package.json').version"
}

check_tag_exists() {
    local tag=$1
    if git ls-remote --tags origin | grep -q "refs/tags/$tag$"; then
        return 0
    else
        return 1
    fi
}

VERSION=$(get_package_version)
if [ -z "$VERSION" ]; then
    echo "Failed to read version from package.json"
    exit 1
fi

TAG="v$VERSION"

echo "Checking if tag $TAG already exists on remote..."
if check_tag_exists "$TAG"; then
    echo "Tag $TAG already exists on remote"
    exit 1
fi

echo "Creating and pushing tag: $TAG"
git tag "$TAG" && git push origin "$TAG"

if [ $? -eq 0 ]; then
    echo "Successfully created and pushed tag: $TAG"
else
    echo "Failed to create/push tag"
    exit 1
fi
