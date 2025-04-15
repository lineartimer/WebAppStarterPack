#!/usr/bin/env bash

echo
echo "Creating some data..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"

curl -v -X POST http://localhost:5000/Data/Bulk -H "Content-Type: application/json" --data @create-data.json

echo
read -p "Press any key to continue..."
