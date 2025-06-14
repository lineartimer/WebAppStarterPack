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
printf "${BOLD}=========== WebAppStarterPack: Azure Resource Deletion Script ===========${NC}\n"
echo

# Login
if ! command -v az &> /dev/null; then
    printf "${RED}Error: Azure CLI is not installed. Please install it first.${NC}\n"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

if ! az account show &> /dev/null; then
    printf "${YELLOW}You need to log in to Azure first.${NC}\n"
    read -p "Press Enter to open Azure login..."
    az login
fi
printf "Logged in to Azure\n"

CURRENT_SUB=$(az account show --query "name" -o tsv)
printf "Current subscription: ${CURRENT_SUB}\n"

echo

# Collecting information for deletion
RESOURCE_GROUP="rg-WebAppStarterPack"

if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    printf "${YELLOW}Resource group '$RESOURCE_GROUP' does not exist.${NC}\n"
    printf "Nothing to delete.\n"
    echo
    read -p "Press any key to continue..."
    exit 0
fi

printf "${YELLOW}Resources that will be deleted:${NC}\n"
echo
az resource list --resource-group "$RESOURCE_GROUP" --query "[].{Name:name, Type:type}" --output table
echo

# Multiple confirmation prompts for safety
printf "${RED}DANGER ZONE${NC}\n"
printf "${RED}This action will permanently delete:${NC}\n"
printf "${RED}- Resource group: $RESOURCE_GROUP${NC}\n"
printf "${RED}- All resources inside it (see above)${NC}\n"
printf "${RED}- This action cannot be undone!${NC}\n"
echo

read -p "Are you absolutely sure you want to delete everything? (y/n): " CONFIRM1
if [[ ! $CONFIRM1 =~ ^[Yy]$ ]]; then
    printf "${YELLOW}Deletion cancelled.${NC}\n"
    read -p "Press any key to continue..."
    exit 0
fi

read -p "Type DELETE to delete: " CONFIRM2
if [ "$(echo "$CONFIRM2" | tr '[:upper:]' '[:lower:]')" != "delete" ]; then
    printf "${YELLOW}Deletion cancelled.${NC}\n"
    exit 0
fi

echo

# Deleting resources
az group delete \
  --name "$RESOURCE_GROUP" \
  --yes \
  --no-wait

if [ $? -eq 0 ]; then
    SPINNER_CHARS="/-\\|"
    SPINNER_INDEX=0
    ROUND_COUNT=0
    
    while true; do
        # Check Azure status every 15s
        if [ $ROUND_COUNT -eq 0 ]; then
            if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
                break
            fi
        fi
        
        # Show spinner
        CHAR=${SPINNER_CHARS:$SPINNER_INDEX:1}
        printf "\r${CHAR} Deleting resources. This may take many minutes..."
        
        # Update spinner
        SPINNER_INDEX=$(((SPINNER_INDEX + 1) % ${#SPINNER_CHARS}))
        ROUND_COUNT=$(((ROUND_COUNT + 1) % 120))
        sleep 0.125
    done
    
    # Clear spinner
    printf "\rResources have been deleted successfully!                    \n"
    echo
else
    echo
    printf "${RED}Deletion failed.${NC}\n"
    exit 1
fi

echo
read -p "Press any key to continue..."