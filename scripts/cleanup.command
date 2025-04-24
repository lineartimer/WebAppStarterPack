#!/usr/bin/env bash
echo
echo "Cleaning up..."
echo

cd -- "$(dirname -- "$BASH_SOURCE")"

rm -rf ../src/.vs

rm -rf ../src/.vscode
rm -rf ../src/Backend/.config
rm -rf ../src/Backend/bin
rm -rf ../src/Backend/obj
rm -rf ../src/Backend/Properties/PublishProfiles/FolderProfile.pubxml.user
rm -rf ../src/Backend/Backend.csproj.user

rm -rf ../src/Backend.Tests/bin
rm -rf ../src/Backend.Tests/obj
rm -rf ../src/Backend.Tests/TestResults

rm -rf ../src/Frontend/.vscode
rm -rf ../src/Frontend/build
rm -rf ../src/Frontend/node_modules
rm -rf ../src/Frontend/obj
rm -rf ../src/Frontend/package-lock.json

echo
read -p "Press any key to continue..."
