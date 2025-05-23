Web App Starter Pack
====================

![Build (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Build.yml/badge.svg) ![Tests (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Test.yml/badge.svg) ![Build (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Build.yml/badge.svg) ![Tests (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Test.yml/badge.svg)

This is a starter template with a .Net backend, a React frontend and a GitHub CI/CD pipeline that deploys to Azure. This template should enable anyone who wants to build a web app with said tech-stack to get started quickly.

# Getting Started

## Step 1: Set up environment on your local machine

Download and install:
- .NET SDK
- Node.js
- Docker Desktop
- GitHub Desktop

Install VS Code and the following extensions:
- C# Dev Kit
- JavaScript Debugger
- Azure Container Apps
- Docker
- GitHub Copilot

Fork the repo and clone it on your machine.

## Step 2: Create Azure Resources

Create the following resources in Azure:
- Sql Database
- Container Registry

After creating the database, add the connection string to .NET Secrets Manager:\
*dotnet user-secrets init*\
*dotnet user-secrets set "ConnectionStrings:SqlServer" "connection-string-to-database"*

Go to the database and under Security -> Networking, add your machine's IP address as a firewall rule.

Also seed the database using the sqls in src/Db. The simplest way to run these queries is from the Azure Portal. Go to the database, there you'll find the Query editor.

Go to the container registry and under Settings -> Access keys enable the admin user.

Build the Docker images for both the frontend and the backend and push them to the container registry.

Finally, create two Azure Container Apps from the images in the container registry.

## Step 3: Set up CI/CD

Go to the repo and under Settings -> Secrets and variables -> Actions and set the following variables:

**AZURE_APP_ID**, **AZURE_PASSWORD**, **AZURE_TENANT**:
To set the values of these variables, open an Azure CLI (e.g. on the Azure Portal) and create a service principal:

*az ad sp create-for-rbac --name "a-unique-name-that-hasn't-been-used-before" --role contributor --scopes /subscriptions/your-Azure-subscription-id-you-can-find-it-on-the-Azure-Portal-under-your-subscription)*

**BACKEND_SUBDOMAIN**, **BACKEND_REGION**:
Go to container app. The url of it will look something like this:\
*name-of-the-container-app.a-randomly-generated-subdomain.a-region.azurecontainerapps.io.*\
Copy and paste the information from the url.

**CONTAINER_REGISTRY**, **CONTAINER_REGISTRY_USERNAME**, **CONTAINER_REGISTRY_PASSWORD**:
Go to the container registry and from under Settings -> Access keys copy and paste the information from the url.

**DB_SERVER_NAME**, **DB**, **DB_USER**, **DB_PASSWORD**:
To set the values of these variables, go to the database and from under Settings -> Connection Strings copy and paste the information.

**CONTAINER_APP_NAME**, **RESOURCE_GROUP**:
These are not GitHub secrets but should be set in .github/workflows/Backend.Deploy.yml. The information can be found on the Azure Portal under the container apps and the resource group.

### Triggering the CI/CD pipeline

- Create a new development/feature branch and make some changes
- Commit and push the changes
- Create a pull request back to the main branch
- Squash and merge the pull request
- To check the details of the workflows go to the Actions tab of your repo on GitHub
- The result of the latest runs will be displayed in the Readme file
