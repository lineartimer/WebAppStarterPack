#!/usr/bin/env bash

echo
echo "Running Backend..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"
cd ../src/Backend

dotnet run

echo
read -p "Press any key to continue..."
