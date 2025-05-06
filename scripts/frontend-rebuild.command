#!/usr/bin/env bash

echo
echo "Rebuilding Frontend..."
echo

osascript <<eof
tell application "Terminal"
    set bounds of front window to {775, 495, 1470, 870}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"

rm -rf ../src/Frontend/build
rm -rf ../src/Frontend/obj
rm -rf ../src/Frontend/node_modules
rm -rf ../src/Frontend/package-lock.json

cd ../src/Frontend
npm install

echo
read -p "Press any key to continue..."
