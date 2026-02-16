#!/bin/bash

# Runestone Package Script
# Runs the complete packaging pipeline: lint -> typecheck -> test -> build

set -e

echo "Starting package process..."

echo "Running linter..."
npm run lint

echo "Running type check..."
npm run check

echo "Running tests..."
npm run test | npx faucet

echo "Building project..."
npm run build

echo "Package process completed successfully."
