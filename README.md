Web App Starter Pack
====================

![Build (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Build.yml/badge.svg) ![Tests (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Test.yml/badge.svg) ![Build (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Build.yml/badge.svg) ![Tests (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Test.yml/badge.svg)

This is a starter template with a .Net backend and a React frontend along with a GitHub CI/CD pipeline that deploys to Azure. The goal of this project is to help anyone, who wants to build a web app with said tech stack, to get going fast.

# Getting Started

## Grab the Source Code

Fork the repo and clone it.

## Create Azure Resources

- Create an Sql Database in Azure and put some data in it (e.g. by running the insert statements in src/Db/Init.sql)
- Open VS Code and install the following extensions: C# Dev Kit, SQL Server, GitHub CoPilot/Chat, Azure App Service, Azure Container Apps, Docker
- Add the connection string to .Net Sectets Manager (e.g. from VS Code Terminal):
    - dotnet user-secrets init
    - dotnet user-secrets set "ConnectionStrings:SqlServer" "<connection string>"
- Create an Azure Container Registry and under Settings -> Access keys enable the admin user
- Build the Docker image and push it to the container registry
- Create an Azure Container App from the image in the container registry

## Set Up CI/CD

Go to the repo, then Settings -> Secrets and variables -> Actions and set the following variables:
- AZURE_APP_ID, AZURE_PASSWORD, AZURE_TENANT
    - To set the values of these variables, open an Azure CLI (e.g. on the Azure Portal)
    - Create a service principal: az ad sp create-for-rbac --name "<a unique name that hasn't been used before>" --role contributor --scopes /subscriptions/<your Azure subscription id (you can find it on the Azure Portal under your subscription)>
- BACKEND_SUBDOMAIN, BACKEND_REGION
    - Go to container app. The url of it will look like this: <name of the container app>.<a randomly generated subdomain>.<region>.azurecontainerapps.io
- CONTAINER_REGISTRY, CONTAINER_REGISTRY_USERNAME, CONTAINER_REGISTRY_PASSWORD
    - To set the values of these variables, go to the container registry, then Settings -> Access keys
- DB_SERVER_NAME, DB, DB_USER, DB_PASSWORD
    - To set the values of these variables, go to the database, then Settings -> Connection Strings

Open .github/workflows/Backend.Deploy.yml and set the following variables:
- CONTAINER_APP_NAME, RESOURCE_GROUP
    - Can be set from the resources on the Azure Portal

### Trigger the CI/CD Pipeline

- Create a new development/feature branch and make some changes
- Commit and push the changes
- Create a pull request back to the main branch
- Squash and merge the pull request
- To check the details of the workflows go to the Actions tab of your repo on GitHub
- The result of the latest runs will be displayed in the Readme file
