WebApp
======

# Environment

- VS Code
- VS Code extensions (C# Dev Kit, SQL Server, GitHub CoPilot/Chat, Azure App Service, Azure Container Apps, Docker)
- .NET SDK
- Node.js
- Docker Desktop

## Creating a new .NET Core Web API project

Even numbered .NET versions have LTS (3 years of support).

### Command line

dotnet new webapi -n WebApplication1
dotnet run

### Visual Studio Code

VS Code -> Explorer (top left) -> Create .NET Project -> ASP.NET Core Web API

### Adding unit tests

- Open the command palette (hit F1), then .NET: New Project, xUnit Test Project and give your project a name
- In VS Code terminal cd into the src folder and run

dotnet add Backend.Tests/Backend.Tests.csproj reference Backend/Backend.csproj

- To run the test cd into the Backend.Tests directory, build the project and run it

dotnet build
dotnet test bin/Debug/net8.0/Backend.Tests.dll --logger "trx;logfilename=Results.xml"

# Azure

It's a good practice to prefix Azure resources. E.g. "rg-" for resource groups or "db-" for databases.

The Azure CLI can be run from within the Azure Portal (click the Cloud Shell icon on the menubar).

## Virtual Machine

Creating a web server:
- From availability options, select no infrastructure redundancy required
- Select standard for security type
- For OS, select Windows Server 2022 Datacenter - x64 Gen2
- Select Standard_B2s - 2 vcpus, 4 GiB memory as size
- Select http, https and ssh for inbound ports in addition to rdp which is already selected by default
- On the disks tab, select standard ssd as a locally redundant storage
- Make sure the delete with vm checkbox is checked
- On the networking tab, make sure that allow selected ports is selected as public inbound ports and select http, https, ssh and rdp as inbound ports
- Make sure the delete public ip and nic when vm is deleted checkbox is checked
- Shut down the server when you don't need it to save money

Configuring the server:
- When the server starts up, allow it to be discoverable by other devices on the same network (it's the recommended setting for home/work networks)
- Do a Windows update and restart if necessary: Start -> Settings -> Update & Security -> Check for updates
- To allow network sharing click on the server on portal.azure.com, go Networking -> Network Settings and create a new inbound port rule for destination TCP port 445. Name the port rule NetworkShare for example
- Share a folder on the server and connect to it (from Finder Go -> Connect to server -> smb://<IP address> -> Connect then navigate to the folder, hover the mouse over the folder name in the upper-left part and drag and drop it to Locations on the left to have it easily accessible)
- (If the shared folder is not accessible on Windows, try switching off the firewall in the anti-virus software)

Configuring IIS:
- Add IIS: Start -> Server Manager -> Manage -> Add roles and features -> Nexts -> Add Web Server (IIS) -> Nexts -> On Select Role Services add Web Server/Application Development/ASP.NET 4.8 -> Next -> Install -> Close
- Verify the installation by opening localhost on the server and visiting the IP address of the server in the browser from another machine
- Install the .NET Core Hosting Bundle
- Create an IISApplications folder on the C drive for the apps

Publishing a web api to IIS:
- Publish your app (web api) and copy it over the server into the IISApplications folder
- Right click the default website and add a new application (a virtual directory won't do either for a .NET Core Web Api or for an ASP.NET Web Forms App)

Publishing a react app to IIS:
- Add "homepage": "." to the root of package.json, otherwise the resources might not be found on the server if the app is deployed as an application under a website
- To create a production build, run: npm run build
- Copy the build folder into the IISApplications folder and rename it to the name of the application
- Right click the default website and add a new application
- If IIS is loading some cached version of some files instead of what is actually in the IISApplication folder, restarting the server will surely solve it
- If you get a 404 error upon loading the app, check the app pool and if the default app pool is used, change it to an appropriate version of .NET (e.g. .NET 4.5) or .NET Core

## SQL Server

Creating an SQL database:
- Under Compute + storage click Configure database and make sure that under the vCore model, General Purpose (Most budget friendly) is selected, then make sure that the Serverless option is selected. Make sure that the Enable auto-pause checkbox is checked and set the auto-pause delay to 15 mins. Set the maximum size of the database to 4 GB. Make sure that the database zone redundancy is set to No
- To avoid legal troubles concerning data residency, select Locally-redundant backup storage
- Go to the database and click Set server firewall. Under the Public access tab, select Selected networks and under Firewall rules, click Add your client IPv4 address. Optionally, change the name of the rule to the computer name you're connecting to the database. Also, add the IP address of the web server. Click Save
- Install the Microsoft.Data.SqlClient (it has replaced System.Data.SqlClient) NuGet package in the backend
- Connect to the database from VS Code with the SQL Server (mssql) extension. Once installed, click on the DB tab on the left and add your connection
- You can also log in to your database (and query and update data) via the Azure Portal. Go to the DB and click Query Editor
- The connection string to the DB is under Settings -> Connection Strings

## Storage Account

- It's used to store images or any large binary data
- Like a DB, it has a connection string
- Images can be uploaded using the Azure Portal (Storage Browser) and then the urls can be stored in a SQL DB
- To upload images from your app, use the Azure.Storage.Blobs and the Microsoft.Extensions.Azure package

## Azure Web App

Creating an Azure Web App for the web api:
- (Make sure that Try a unique hostname is set to off)
- Choose the Free F1 (Shared infrastructure) Pricing plan
- On the Monitor + secure tab, disable Application Insights
- Go to the resource and click Browse to see what is there by default

Deploying the web api:
- In the terminal within VS Code, navigate to the Backend folder and build the project: dotnet publish -c Release -o ./bin/Publish Backend.csproj
- Click on the Azure icon and sign in to your Azure account. Then under resources, you should be able to see your subscription and the resources under that subscription
- Right click the folder in the bin folder that contains the output of your build and click Deploy to WebApp. When prompted, select your WebApp you created in Azure then click Deploy

## Azure Static Web App

Creating an Azure Static Web App for the React website:
- On the Azure Portal, click Create a resource and under the Web tab click Create Static Web App
- Select Free for the plan type, GitHub as the source. Log in with your GitHub account and specify the repository and the branch where your app is located. As Build presets, choose Custom. The App location and the Output location should point to the folder where your build output is (e.g. /build/bin/WebApp). Under the Deployment configuration tab, select GitHub
- If you go to the resource once it's created, you'll see a notification saying "Thank you for using Azure Static Web Apps! We have not received any content for your site yet." Click on it and it will take you over to GitHub to the Actions tab of your repository. You'll see there the Azure workflow being run. When the workflow finished successfully, you'll see a green tick next to it

## Azure Container App

Supports scale based on traffic. If a container is not being used, it will scale down to zero.

Azure Container Instance: scale, load-balancing or certificates aren't provided.

### .NET Core Web API (backend)

Creating an Azure Container Registry:
- On the Azure Portal create a new container registry with a Basic pricing plan
- Go to the resource and under Settings -> Access keys, enable the Admin user

Creating a Docker image:
- Install Docker Desktop and go with the recommended settings (this will require a password). You don't need to create an account. (Allowing Docker to discover devices on your local network may not be necessary)
- In VS Code hit F1 and type Docker: Add Docker Files to Workspace. Select the .NET project, .NET: ASP.NET Core, Linux and leave the port number empty. Click no when asked whether to include optional Docker Compose files. If asked whether to overwrite already existing Docker launch configurations, click overwrite
- Start Docker Desktop and update it if necessary
- In VS Code Terminal cd into the root directory of the repo and run

docker build --no-cache -f src/Backend/Dockerfile -t backend:latest --platform linux/amd64 .

- You can list the content of a directory by inserting RUN dir . at the appropriate location in the docker file
- You can get the directory you're in by echo %cd%
- (You can delete everything from Docker including the caches: docker system prune -a -f)

Adding the Docker image to the container registry:
- On the Docker tab in VS Code, click Connect Registry (plug icon) and select Azure Container Registry. Then click on Azure in the Registries panel and sign in. Then you should be able to see the container registry you created above
- On the Images panel, right click the image and click Push. Select your container registry. When prompted, allow VS Code to access data from other apps
- (Your Docker image should appear on the Registries panel. Right click the image and click Deploy Image to Azure Container Apps)

Creating a Container App:
- Create a Container App
- On the Container tab, select the registry, the image and the image tag that you created above
- For development stack select .NET
- For CPU and memory, select 0.25 CPU cores and 0.5 GB memory
- On the Ingress tab, enable Ingress and select Accepting traffic from anywhere

## Azure Function

- It's like a Container App but it's optimized for event-driven applications
- It's very cost-efficient
- Triggers srart the function (e.g. HTTP requests or timers) and they may have input data

## Network

Zero trust architecture is a security strategy. The principle is that users and devices should not be trusted by default, even if they are connected to a corporate network. It ensures least privilege access to only explicitly-authorized resources. The traditional approach by trusting users and devices within a network is commonly not sufficient in the complex environment of a corporate network. The zero trust approach moves away from trust-by-default to trust-by-exception.

Microsoft is making Security Defaults (preconfigured security settings) available to everyone to ensure that all organizations have at least a basic level of security enabled at no extra cost. 99.9% of common identity-related attacks are stopped by using multifactor authentication.

### Admin

To manage users, go to Microsoft Entry ID -> Users

To assign roles to a subscription, go to the subscription and under Access Control (IAM) -> Role assignments you can list roles assigned to users or service principals.

# Git

- Mac: Github Desktop
- (Win: Tortoise Git)

Semantic versioning:
- Major: Backward incompatible changes
- Minor: New features but backwards compatible
- Patch: Backwards compatible bug fixes only

A branch can be squashed, merged and pushed back to the original branch from GitHub Desktop (switch over to the original branch, then Branch -> Squash and Merge into Current Branch, select the branch you want to merge back and then push to origin)

The main branch can be protected by adding rulesets (e.g. deletions can be restricted, an approved PR can be mandatory for merging or force pushes can be blocked): go on GitHub -> Settings -> Rules -> Rulesets

## CI/CD with GitHub actions

- On the Actions tab of your repository on GitHub, click New workflow and set up a workflow. This will add a new yaml file under .github/workflows folder. Add the workflow and then click Commit changes
- For GitHub to be able to deploy to Azure, you'll need to to provide GitHub with your login credentials, which you can do on the Settings tab under Secrets and variables -> Actions
- (If your repository is public, you can also add environment secrets)
- Click New repository secret and add CONTAINER_REGISTRY_USERNAME. On the Azure Portal go to your container registry and under Settings -> Access keys, you can copy the Username and paste it as the secret on GitHub
- In a simliar way, create CONTAINER_REGISTRY_PASSWORD
- Also, create AZURE_APP_ID, AZURE_PASSWORD, and AZURE_TENANT but to do that you'll need to install Azure CLI. To get Azure CLI on Mac, you first need to install homebrew. When homebrew is installed, open a Terminal and run

brew update && brew install azure-cli

- If you get a "command not found brew" error, open a Terminal and run

cd /opt/homebrew/bin/
PATH=$PATH:/opt/homebrew/bin
echo export PATH=$PATH:/opt/homebrew/bin >> ~/.zshrc

- To update Azure CLI: az upgrade
- To log in to Azure CLI: az login
- To create a service principal: az ad sp create-for-rbac --name "<a unique name that hasn't been used before>" --role contributor --scopes /subscriptions/<your Azure subscription id (you can find it on the Azure Portal under your subscription)>
- Save the appId, the password and the tenant as GitHub secrets to be able to log in to Azure from the yml file (az login --service-principal -u <appId> -p <password> --tenant <tenant>)
- The Azure CLI can also be started from the Azure Portal (click the cloud shell icon in the upper right corner)
- You can manage the created service principals on the Azure Portal under Microsoft Entra ID -> App registrations -> All applications

# Backend development

## C#

Cmd + K, C: comments the selected lines
Cmd + K, U: uncomments the selected lines

Concatenate strings with string interpolation (it's a shorthand for string.Format):

string str1 = "a";
string str2 = "b";

string str3 = $"{str1} and {str2}";

Use
- GitHub CoPilot
- Implicitly typed local variables (var)
- LINQ in conjunction with for loops to query lists
- File-scoped namespaces
- Object initializers
- (Primary constructors)

Null-forgiving operator: !

Your basically telling the compiler: "Trust me, this isn't null!"

Property initialization:

public int Count { get; set; } = 0;

## ASP.NET Core

The curl command can be used to call an endpoint. The body of the request can be saved in a json file (adding the verbose option will return the http response status too):

curl -v -X <request method e.g. POST> <url> -H "Content-Type: application/json" --data @<relative path to json file>

CORS restrictions only work in browsers. They don't work with curl, Postman or similar tools.

Asynchronous methods are a best practice in production-grade modern ASP.NET Core applications, especially when interacting with databases. They don't block the thread and they scale better because they allow the server to handle more requests simultaneously. This improves responsiveness.

Middleware can be used to write common functionality that will execute for every request.

DTOs (Data Transfer Object) only contain the information needed for specific operations (e.g. there can be a User model that contains all user information and a UserDto class that only contains the user name and the password).

## Entity Framework Core

Nuget packages:
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design
- Microsoft.EntityFrameworkCore.Tools

To add a package, cd into the project's directory and run: dotnet add package <package name>

Connection strings should be stored safely. Either in an environment variable or with .NET Sectets Manager or in an Azure Vault.

Eager loading vs. lazy loading: to enable lazy loading, install the Microsoft.EntityFrameworkCore.Proxies.

When EF Core queries a DB, it stores a snapshot of the result set in memory. Any changes to the entities are made against that snapshot and only later written to the DB. To speed up read only queries, you can skip the snapshot and conserve system resources by adding the AsNoTracking() method to the query.

###  Creating a new DB from the code

Add the models to your project and the database context.

Install the .NET EF tool: dotnet tool install -g dotnet-ef

To create a migration: dotnet ef migrations add <name of migration>

Check the migration files if they are correct, run the migration: dotnet ef database update

If you change the data model, change the model files then create and run another migration.

Fluent API use extension methods to chain methods together along with lamda expressions to specify the query. The same can be achieved with LINQ syntax.

### Scaffolding code from an existing DB

Build the project, then run:

dotnet ef dbcontext scaffold "<connection string>" Microsoft.EntityFrameworkCore.SqlServer --context-dir Data --output-dir Models --data-annotations

If the database model changes, you can either manually update the entity model or you can rescaffold the entity models. But to go with the second option, you need to keep business logic separate from db entities. First, delete the enitity model by deleting the Data and the Models directories from the project. Then run:

dotnet ef dbcontext scaffold "<connection string>" Microsoft.EntityFrameworkCore.SqlServer --context-dir Data --output-dir Models/Generated --context-namespace <name of your app>.Data --namespace <name of your app>.Models

Then create partial classes in the models directory to add any further logic to the classes

### Different DB providers

To add an additional (e.g. Sqlite) DB context to the project:
- Create the database and put data in it (e.g. with DB Browser for Sqlite)
- The changes made in DB Browser for Sqlite need to be saved (it doesn't save changes automatically)
- Install the Microsoft.EntityFrameworkCore.Sqlite package
- Instead of using SqlServer use Sqlite:

services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(connStr));

### .NET Secrets Manager

To add a connection string to the .NET Secrets Manager:

dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:<name of connection string>" "<connection string>"

The secrets are stored in ~/.microsoft/usersecrets/<user_secrets_id>/secrets.json

The UserSecretsId is added to the .csproj file.

To get the connection string in Program.cs:

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

To list user secrets: dotnet user-secrets list

To delete user secrets: dotnet user-secrets clear

## Authentication

### Microsoft Entra

One option is Microsoft Entra, which delivers unified zero-trust user access. Generally, a Microsoft account is needed but external identity providers can also be used (like Google/Facebook etc.). Also, custom email/password authentication can be used.

### JWT (JSON Web Token) authentication

JWT is a lightweight authentication mechanism. It uses tokens signed with a secret. The client sends the token in the Authorization header with each request. It's easy to integrate with third-party identity providers but a custom identity provider can also be implemented.

If only authentication with email and password is needed (and no third-party providers like Google or Facebook) a custom JWT-based authentication system is sufficient.

Install the Microsoft.AspNetCore.Authentication.JwtBearer package

### API key authentication

It's a way to do machine-to-machine authentication to secure internal APIs. The API keys can be GUIDs or secure random strings which are sent in the Authorization header of the request. The client needs this API key and the backend will only process the request if it's correct, otherwise send back a 401 response. The checking is implemented in a middleware component.

## Postman

To make a post request, add Content-Type = application/json to the header and a json object to the body of the request

# Misc

## Firefox

To get the path to the cache:
- Type about:cache in the address bar
- Hit enter

## Mac

To list access privileges for all files in a directory: ls -la

To give a file execute privilege: chmod +x <filename>

To run a .command file downloaded from the Internet, double click it then Settings -> Privacy and Security -> Open Anyway

To list hidden files with Finder: Cmd + Shift + .

Windows App can be used to rdp into a Windows VM.

To find out the ip address of a web server: nslookup <url>

Terminal history can be deleted by deleting the contents of the ~/.zsh_history file or contents of the ~/.zsh_sessions directory.