#!/usr/bin/env bash
echo
echo "Cleaning up..."
echo

W=$(osascript -e 'tell application "Finder" to get bounds of window of desktop' | cut -d',' -f3 | tr -d ' ')
H=$(osascript -e 'tell application "Finder" to get bounds of window of desktop' | cut -d',' -f4 | tr -d ' ')

UH=$((H * 85 / 100))
UHO=$((H * 5 / 100))
QW=$((W / 2))
QH=$((UH / 2))
KH=5
KV=10
WW=$((QW * (100 - 2 * KH) / 100))
WH=$((QH * (100 - 2 * KV) / 100))
X=$((QW * KH / 100))
Y=$((UHO + QH * KV / 100))

osascript <<eof
tell application "Terminal"
    set bounds of front window to {$X, $Y, $((X + WW)), $((Y + WH))}
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
rm -rf ../src/Frontend/e2e-tests/node_modules
rm -rf ../src/Frontend/e2e-tests/playwright-report
rm -rf ../src/Frontend/e2e-tests/test-results
rm -rf ../src/Frontend/e2e-tests/package-lock.json

npm cache clean --force

echo
read -p "Press any key to continue..."