#!/usr/bin/env bash
echo
echo "Cleaning up..."
echo

osascript <<eof
tell application "Terminal"
    set bounds of front window to {40, 80, 735, 455}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"

rm -rf ../src/.vs

rm -rf ../src/Backend/.config
rm -rf ../src/Backend/bin
rm -rf ../src/Backend/obj
rm -rf ../src/Backend/Properties/PublishProfiles/FolderProfile.pubxml.user
rm -rf ../src/Backend/Backend.csproj.user

rm -rf ../src/Backend.Tests/bin
rm -rf ../src/Backend.Tests/obj
rm -rf ../src/Backend.Tests/TestResults

rm -rf ../src/Frontend/.vscode
rm -rf ../src/Frontend/.next
rm -rf ../src/Frontend/build
rm -rf ../src/Frontend/out
rm -rf ../src/Frontend/node_modules
rm -rf ../src/Frontend/obj
rm -rf ../src/Frontend/certificates
rm -rf ../src/Frontend/package-lock.json

npm cache clean --force

echo
read -p "Press any key to continue..."
