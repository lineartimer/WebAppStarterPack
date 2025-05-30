#!/usr/bin/env bash

echo
echo "Rebuilding Frontend..."
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

X=$((QW + QW * KH / 100))
Y=$((UHO + QH + QH * KV / 100))

osascript <<eof
tell application "Terminal"
    set bounds of front window to {$X, $Y, $((X + WW)), $((Y + WH))}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"

rm -rf ../src/Frontend/build
rm -rf ../src/Frontend/obj
rm -rf ../src/Frontend/node_modules
rm -rf ../src/Frontend/package-lock.json

cd ../src/Frontend
npm install
./node_modules/.bin/jest --clearCache

cd e2e-tests
npm install
npx playwright install
./node_modules/.bin/jest --clearCache

echo
read -p "Press any key to continue..."
