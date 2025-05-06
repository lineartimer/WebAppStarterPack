#!/usr/bin/env bash

echo
echo "Rebuilding and Running Backend..."
echo

osascript <<eof
tell application "Terminal"
    set bounds of front window to {775, 80, 1470, 455}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"
cd ../src/Backend

# Rebuilding and running backend
dotnet build --no-incremental
dotnet run

echo
read -p "Press any key to continue..."
