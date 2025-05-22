#!/usr/bin/env bash

echo
echo "Running Frontend..."
echo

osascript <<eof
tell application "Terminal"
    set bounds of front window to {775, 495, 1470, 870}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"
cd ../src/frontend

npm start

echo
read -p "Press any key to continue..."
