Web App Starter Pack (Wasp 🐝)
===========================

![Build (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Build.yml/badge.svg) ![Tests (backend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Backend.Test.yml/badge.svg) ![Build (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Build.yml/badge.svg) ![Tests (frontend)](https://github.com/lineartimer/WebAppStarterPack/actions/workflows/Frontend.Test.yml/badge.svg)

This is a starter template with a .Net backend, a React (Next.js) frontend and a GitHub CI/CD pipeline that deploys to Azure.

The template also comes with xUnit unit and integration tests for the backend, and Jest unit tests and Playwright end-to-end tests for the frontend.

This template should enable anyone who wants to build a web app with said tech-stack to get started quickly.

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
- SQL Server
- Azure Container Apps
- Bicep
- Docker
- Playwright
- GitHub Copilot

Fork the repo and clone it on your machine.

## Step 2: Create Azure Resources

There are two ways to create the required Azure resources:

### Automatic

The simpliest way is to run infrastructure/create-azure-resources.command.

You will need to specify the region for the resources and provide a username and a password for the database admin user. The script takes a few minutes to run and will create all the resources necessary with the correct configuration.

If you don't need the resources anymore, you can delete them with the delete script. (This will take longer than creating the resources.)

### Manual

You can also create the resources manually on the Azure Portal.

First, you'll need to create:
- A VNet with 3 subnets in it: one for the database, one for the backend, and one for the frontend
- NSGs for the database, the backend and the frontend subnets
- Private endpoints for the database
- An Sql Database
- A Container Registry

For the exact configuration, check out the .bicep files in the infrastructure folder.

After creating the database, you can add the connection string to .NET Secrets Manager (but it's optional as the repo has a local Sqlite database for development purposes):

*dotnet user-secrets init*\
*dotnet user-secrets set "ConnectionStrings:SqlServer" "connection-string-to-database"*

Go to the database and under Security -> Networking, add your machine's IP address as a firewall rule.

Go to the container registry and under Settings -> Access keys enable the admin user.

Build the Docker images for both the frontend and the backend and push them to the container registry.

Finally, create two Azure Container Apps from the images in the container registry. Use different environments for the frontend and the backend.

## Step 3: Seed the database

You'll need to seed the database using the sqls in src/Db. The simplest way to run these queries is from the Azure Portal. Go to the database, there you'll find the Query editor, which can run sql queries.

### Step Create users

You'll also need to create users. To do that, open Postman and
- Call the backend's Auth/GetXcsrfToken endpoint. This will return an X-CSRF token
- Copy the token and call Auth/Signup with the token in the header of the request with the key X-CSRF. Provide the information that's needed for signup in the body of the request:

```json
{
    "Username": "someuser",
    "Password": "somepassword",
    "Email": "someuser@someemailprovider.com",
    "FirstName": "somefirstname",
    "Role": "User"
}
```

To create an admin user, change the role to "Admin".

## Step 4: Set up CI/CD

Go to the repo and under Settings -> Secrets and variables -> Actions set the following variables:

**AZURE_APP_ID**, **AZURE_PASSWORD**, **AZURE_TENANT**:
To set these variables, open an Azure CLI (e.g. on the Azure Portal) and create a service principal:

*az ad sp create-for-rbac --name "a-unique-name-that-hasn't-been-used-before" --role contributor --scopes /subscriptions/your-Azure-subscription-id-you-can-find-it-on-the-Azure-Portal-under-your-subscription*

**RESOURCE_GROUP**:
Go to the resource group and copy and paste its name.

**BACKEND_NAME**, **BACKEND_SUBDOMAIN**, **BACKEND_REGION**:
Go to backend container app. The url of it will look something like this:

*name-of-the-container-app.a-randomly-generated-subdomain.a-region.azurecontainerapps.io.*

Copy and paste the information from the url.

**FRONTEND_NAME**, **FRONTEND_SUBDOMAIN**, **FRONTEND_REGION**:
Do the same for the frontend.

**CONTAINER_REGISTRY**, **CONTAINER_REGISTRY_URL**, **CONTAINER_REGISTRY_USERNAME**, **CONTAINER_REGISTRY_PASSWORD**:
Go to the container registry and from under Settings -> Access keys copy and paste the information.

**DB_SERVER_NAME**, **DB**, **DB_USER**, **DB_PASSWORD**:
To set these variables, go to the database and from under Settings -> Connection Strings copy and paste the information.

### Triggering the CI/CD pipeline

This simple version control process can be used for development:
- Create a new development/feature branch and make some changes
- Commit and push the changes
- Create a pull request back to the main branch - this will trigger the deployment
- Squash and merge the pull request, then delete the feature branch
- To check the details of the workflows go to the Actions tab of your repo on GitHub
- The result of the latest runs will be displayed in the Readme file

## Good to know

Both the database and the container apps are created with settings that make it as cheap as possible to run them. This comes with the trade-off that the database is paused after 15 minutes of inactivity and the containers can also scale down to zero instances.

This means that the first time the frontend is loaded after a certain amount of inactivity, it will take several seconds to load and even then it will probably display the error page because the database might need as much as a few minutes to start. But once the resources are up and running, everything should work fine.

In the unlikely case it doesn't, go to the Containers and under Monitoring -> Log Stream, you can check the terminal of both the backend and the frontend - just make sure to select the 'Application' category instead of 'System', which is selected by default. Then, feel free to add diagnostic messages using Console.Writeline or console.log.

Happy coding! 🙂
