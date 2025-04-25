#!/usr/bin/env bash

echo
echo "Running Backend..."
echo

osascript <<eof
tell application "Terminal"
    set bounds of front window to {775, 80, 1470, 455}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"
cd ../src/Backend

dotnet run

echo
read -p "Press any key to continue..."
