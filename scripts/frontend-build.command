#!/usr/bin/env bash

echo
echo "Building Frontend..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"

rm -rf ../src/Frontend/build
rm -rf ../src/Frontend/obj
rm -rf ../src/Frontend/node_modules
rm -rf ../src/Frontend/package-lock.json

cd ../src/Frontend
npm install

echo
read -p "Press any key to continue..."
