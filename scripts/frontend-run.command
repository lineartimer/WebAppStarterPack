#!/usr/bin/env bash

echo
echo "Running Frontend..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"
cd ../src/frontend

npm start

echo
read -p "Press any key to continue..."
