#!/usr/bin/env bash

echo
echo "Deleting all data..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"

curl -v -X DELETE http://localhost:5000/Data/All -H "Content-Type: application/json"

echo
read -p "Press any key to continue..."
