#!/usr/bin/env bash

# Position terminal window
W=$(($(system_profiler SPDisplaysDataType | grep Resolution | awk '{print $2}' | head -1) / 2))
H=$(($(system_profiler SPDisplaysDataType | grep Resolution | awk '{print $4}' | head -1) / 2))

K=60
WW=$((W * K / 100))
WH=$((H * K / 100))
X=$(((W - WW) / 2))
Y=$(((H - WH) / 2))

osascript <<eof
tell application "Terminal"
    set bounds of front window to {$X, $Y, $((X + WW)), $((Y + WH))}
end tell
eof

cd -- "$(dirname -- "$BASH_SOURCE")"

# Colors for output
BOLD='\033[1m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
printf "${BOLD}=========== WebAppStarterPack: Azure Resource Creation Script ===========${NC}\n"
echo

# Login
if ! command -v az &> /dev/null; then
    printf "${RED}Error: Azure CLI is not installed. Please install it first.${NC}\n"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

if ! az account show &> /dev/null; then
    read -p "Press any key to log in to Azure..."
    az login
fi
printf "Logged in to Azure\n"

CURRENT_SUB=$(az account show --query "name" -o tsv)
printf "Current subscription: ${CURRENT_SUB}\n"

echo

# Gathering user input: location
printf "${BOLD}Location Configuration:${NC}\n"
echo "Common locations: westeurope, centralus etc."
read -p "Enter valid Azure location: " LOCATION
if [ -z "$LOCATION" ]; then
    printf "${RED}Location cannot be empty!${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi

DEVELOPER_IP=$(curl -s ifconfig.me 2>/dev/null)
if [ -z "$DEVELOPER_IP" ]; then
    printf "${RED}Could not get IP address!${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi

echo

# Gathering user input: database
printf "${BOLD}Database Configuration:${NC}\n"
read -p "Database admin username: " DB_USERNAME
if [ -z "$DB_USERNAME" ]; then
    printf "${RED}Username cannot be empty!${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi

echo -n "Database admin password (hidden): "
read -s DB_PASSWORD
echo
if [ -z "$DB_PASSWORD" ]; then
    printf "${RED}Password cannot be empty!${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi

echo -n "Confirm password (hidden): "
read -s DB_PASSWORD_CONFIRM
echo
if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    printf "${RED}Passwords do not match!${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi

echo

# Confirmation of deployment
read -p "Proceed with deployment? (y/n): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    printf "${YELLOW}Deployment cancelled.${NC}\n"
    read -p "Press any key to continue..."
    exit 0
fi

echo
echo "Creating resources. Estimated time to finish: 20 minutes..."
echo

# Deploy the Bicep template at subscription level
az deployment sub create \
  --location "$LOCATION" \
  --template-file bicep/main.bicep \
  --parameters location="$LOCATION" \
               developerMachineIP="$DEVELOPER_IP" \
               dbAdminUsername="$DB_USERNAME" \
               dbAdminPassword="$DB_PASSWORD"

if [ $? -eq 0 ]; then
    echo
    printf "Deployment completed successfully!\n"
    read -p "Press any key to continue..."
    exit 0
else
    echo
    printf "${RED}Deployment failed. Check the error messages above.${NC}\n"
    read -p "Press any key to continue..."
    exit 1
fi